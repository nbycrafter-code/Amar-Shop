// queries/slider.ts
import { Slider } from "@/models/slider-model";

export interface SliderType {
  _id?: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  buttonText: string;
  buttonTextBn: string;
  buttonLink: string;
  bgImage: string;
  mobileImage?: string;
  bgVideo?: string;
  textColor: string;
  highlightColor: string;
  gradient: string;
  order: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  views?: number;
  clicks?: number;
  ctr?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Get all active sliders (for frontend display)
export async function getActiveSliders(): Promise<SliderType[]> {
  try {
    const now = new Date();
    const sliders = await Slider.find({
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: null },
        { startDate: { $lte: now } }
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    })
    .sort({ order: 1, created_at: -1 })
    .lean();
    
    // Calculate CTR for each slider
    const slidersWithStats = sliders.map(slider => ({
      ...slider,
      ctr: slider.views && slider.views > 0 
        ? Number(((slider.clicks || 0) / slider.views * 100).toFixed(1))
        : 0
    }));
    
    return slidersWithStats as SliderType[];
  } catch (error) {
    console.error("Error fetching active sliders:", error);
    return [];
  }
}

// Get all sliders (admin)
export async function getAllSliders(): Promise<SliderType[]> {
  try {
    const sliders = await Slider.find({})
      .sort({ order: 1, created_at: -1 })
      .lean();
    
    // Calculate CTR for each slider
    const slidersWithStats = sliders.map(slider => ({
      ...slider,
      ctr: slider.views && slider.views > 0 
        ? Number(((slider.clicks || 0) / slider.views * 100).toFixed(1))
        : 0
    }));
    
    return slidersWithStats as SliderType[];
  } catch (error) {
    console.error("Error fetching all sliders:", error);
    return [];
  }
}

// Get paginated sliders (admin)
export async function getPaginatedSliders(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: 'all' | 'active' | 'inactive'
): Promise<{ sliders: SliderType[]; total: number }> {
  try {
    let query: any = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.active = status === 'active';
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleBn: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [sliders, total] = await Promise.all([
      Slider.find(query)
        .sort({ order: 1, created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Slider.countDocuments(query)
    ]);
    
    // Calculate CTR for each slider
    const slidersWithStats = sliders.map(slider => ({
      ...slider,
      ctr: slider.views && slider.views > 0 
        ? Number(((slider.clicks || 0) / slider.views * 100).toFixed(1))
        : 0
    }));
    
    return {
      sliders: slidersWithStats as SliderType[],
      total
    };
  } catch (error) {
    console.error("Error fetching paginated sliders:", error);
    return { sliders: [], total: 0 };
  }
}

// Get single slider by ID
export async function getSliderById(id: string): Promise<SliderType | null> {
  try {
    const slider = await Slider.findById(id).lean();
    if (!slider) return null;
    
    // Calculate CTR
    const sliderWithStats = {
      ...slider,
      ctr: slider.views && slider.views > 0 
        ? Number(((slider.clicks || 0) / slider.views * 100).toFixed(1))
        : 0
    };
    
    return sliderWithStats as SliderType;
  } catch (error) {
    console.error("Error fetching slider by ID:", error);
    return null;
  }
}

// Create new slider
export async function createSlider(data: Partial<SliderType>): Promise<SliderType | null> {
  try {
    // Auto-generate order if not provided
    if (!data.order || data.order === 0) {
      const lastSlider = await Slider.findOne().sort({ order: -1 });
      data.order = lastSlider ? lastSlider.order + 1 : 1;
    }
    
    const slider = await Slider.create({
      ...data,
      views: 0,
      clicks: 0,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return slider.toObject() as SliderType;
  } catch (error) {
    console.error("Error creating slider:", error);
    return null;
  }
}

// Update slider
export async function updateSlider(id: string, data: Partial<SliderType>): Promise<SliderType | null> {
  try {
    const slider = await Slider.findByIdAndUpdate(
      id,
      { 
        $set: { 
          ...data, 
          updated_at: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).lean();
    
    if (!slider) return null;
    
    // Calculate CTR
    const sliderWithStats = {
      ...slider,
      ctr: slider.views && slider.views > 0 
        ? Number(((slider.clicks || 0) / slider.views * 100).toFixed(1))
        : 0
    };
    
    return sliderWithStats as SliderType;
  } catch (error) {
    console.error("Error updating slider:", error);
    return null;
  }
}

// Delete slider
export async function deleteSlider(id: string): Promise<boolean> {
  try {
    const result = await Slider.findByIdAndDelete(id);
    
    if (result) {
      // Reorder remaining sliders
      const remainingSliders = await Slider.find().sort({ order: 1 });
      const bulkOps = remainingSliders.map((slider, index) => ({
        updateOne: {
          filter: { _id: slider._id },
          update: { $set: { order: index + 1 } }
        }
      }));
      
      if (bulkOps.length > 0) {
        await Slider.bulkWrite(bulkOps);
      }
    }
    
    return !!result;
  } catch (error) {
    console.error("Error deleting slider:", error);
    return false;
  }
}

// Update slider order (bulk)
export async function updateSliderOrder(orders: { id: string; order: number }[]): Promise<boolean> {
  try {
    const bulkOps = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order, updated_at: new Date() } },
      },
    }));
    
    await Slider.bulkWrite(bulkOps);
    return true;
  } catch (error) {
    console.error("Error updating slider orders:", error);
    return false;
  }
}

// Toggle slider status
export async function toggleSliderStatus(id: string, active: boolean): Promise<SliderType | null> {
  try {
    const slider = await Slider.findByIdAndUpdate(
      id,
      { $set: { active, updated_at: new Date() } },
      { new: true }
    ).lean();
    
    if (!slider) return null;
    
    // Calculate CTR
    const sliderWithStats = {
      ...slider,
      ctr: slider.views && slider.views > 0 
        ? Number(((slider.clicks || 0) / slider.views * 100).toFixed(1))
        : 0
    };
    
    return sliderWithStats as SliderType;
  } catch (error) {
    console.error("Error toggling slider status:", error);
    return null;
  }
}

// Increment view count
export async function incrementSliderViews(id: string): Promise<boolean> {
  try {
    const result = await Slider.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }
    );
    return !!result;
  } catch (error) {
    console.error("Error incrementing slider views:", error);
    return false;
  }
}

// Increment click count
export async function incrementSliderClicks(id: string): Promise<boolean> {
  try {
    const result = await Slider.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } }
    );
    return !!result;
  } catch (error) {
    console.error("Error incrementing slider clicks:", error);
    return false;
  }
}

// Get slider statistics
export async function getSliderStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  totalViews: number;
  totalClicks: number;
  averageCtr: number;
}> {
  try {
    const [total, active, inactive, viewsData, clicksData] = await Promise.all([
      Slider.countDocuments({}),
      Slider.countDocuments({ active: true }),
      Slider.countDocuments({ active: false }),
      Slider.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Slider.aggregate([{ $group: { _id: null, total: { $sum: '$clicks' } } }])
    ]);
    
    const totalViews = viewsData[0]?.total || 0;
    const totalClicks = clicksData[0]?.total || 0;
    const averageCtr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
    
    return {
      total,
      active,
      inactive,
      totalViews,
      totalClicks,
      averageCtr: Number(averageCtr.toFixed(1))
    };
  } catch (error) {
    console.error("Error getting slider stats:", error);
    return {
      total: 0,
      active: 0,
      inactive: 0,
      totalViews: 0,
      totalClicks: 0,
      averageCtr: 0
    };
  }
}

// Get sliders by date range
export async function getSlidersByDateRange(startDate: Date, endDate: Date): Promise<SliderType[]> {
  try {
    const sliders = await Slider.find({
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ created_at: -1 })
    .lean();
    
    return sliders as SliderType[];
  } catch (error) {
    console.error("Error fetching sliders by date range:", error);
    return [];
  }
}

// Duplicate slider
export async function duplicateSlider(id: string): Promise<SliderType | null> {
  try {
    const originalSlider = await Slider.findById(id).lean();
    if (!originalSlider) return null;
    
    const { _id, created_at, updated_at, views, clicks, ...sliderData } = originalSlider;
    
    const newSlider = await Slider.create({
      ...sliderData,
      title: `${sliderData.title} (Copy)`,
      titleBn: `${sliderData.titleBn} (কপি)`,
      views: 0,
      clicks: 0,
      order: await getNextOrder(),
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return newSlider.toObject() as SliderType;
  } catch (error) {
    console.error("Error duplicating slider:", error);
    return null;
  }
}

// Helper function to get next order number
async function getNextOrder(): Promise<number> {
  const lastSlider = await Slider.findOne().sort({ order: -1 });
  return lastSlider ? lastSlider.order + 1 : 1;
}

// Bulk update status
export async function bulkUpdateStatus(ids: string[], active: boolean): Promise<boolean> {
  try {
    await Slider.updateMany(
      { _id: { $in: ids } },
      { $set: { active, updated_at: new Date() } }
    );
    return true;
  } catch (error) {
    console.error("Error bulk updating slider status:", error);
    return false;
  }
}

// Bulk delete sliders
export async function bulkDeleteSliders(ids: string[]): Promise<boolean> {
  try {
    const result = await Slider.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount > 0) {
      // Reorder remaining sliders
      const remainingSliders = await Slider.find().sort({ order: 1 });
      const bulkOps = remainingSliders.map((slider, index) => ({
        updateOne: {
          filter: { _id: slider._id },
          update: { $set: { order: index + 1 } }
        }
      }));
      
      if (bulkOps.length > 0) {
        await Slider.bulkWrite(bulkOps);
      }
    }
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error bulk deleting sliders:", error);
    return false;
  }
}