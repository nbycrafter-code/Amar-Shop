// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Contact } from "@/models/contact-model";
import { headers } from "next/headers";

// Email sending helper (optional - you can use nodemailer, resend, etc.)
// import { sendEmail } from "@/lib/email";

// ==================== GET: Fetch contact messages ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const isRead = searchParams.get('isRead');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    if (id) {
      // Get single message by ID
      const message = await Contact.findById(id);
      if (!message) {
        return NextResponse.json(
          { error: "Message not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: message,
      });
    } else {
      // Build query
      let query: any = {};
      if (status) query.status = status;
      if (isRead !== null) query.isRead = isRead === 'true';
      
      // Get all messages with pagination
      const messages = await Contact.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Contact.countDocuments(query);
      
      return NextResponse.json({
        success: true,
        data: messages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    console.error("❌ Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create new contact message ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    
    // Validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    if (!email || email.trim() === "") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    
    if (!subject || subject.trim() === "") {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }
    
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    
    // Get IP address and user agent
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Check for spam (optional: limit by IP address)
    const recentMessages = await Contact.countDocuments({
      ipAddress,
      created_at: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
    });
    
    if (recentMessages > 5) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }
    
    // Create contact message
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
      status: "pending",
      isRead: false,
    });
    
    // Optional: Send email notification to admin
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `New Contact Message: ${subject}`,
    //   html: `
    //     <h2>New Contact Message</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });
    
    // Optional: Send auto-reply to user
    // await sendEmail({
    //   to: email,
    //   subject: "Thank you for contacting us",
    //   html: `
    //     <h2>Thank you for reaching out!</h2>
    //     <p>Dear ${name},</p>
    //     <p>We have received your message and will get back to you within 24 hours.</p>
    //     <p>Best regards,<br/>Team</p>
    //   `,
    // });
    
    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
      data: contact,
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error creating contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update contact message (mark as read/replied) ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, isRead, replyMessage } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;
    if (replyMessage) {
      updateData.replyMessage = replyMessage;
      updateData.status = "replied";
      updateData.repliedAt = new Date();
    }
    
    updateData.updated_at = new Date();
    
    const updatedMessage = await Contact.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }
    
    // Optional: Send reply email to user
    // if (replyMessage) {
    //   await sendEmail({
    //     to: updatedMessage.email,
    //     subject: `Re: ${updatedMessage.subject}`,
    //     html: `
    //       <h2>Response to your message</h2>
    //       <p>Dear ${updatedMessage.name},</p>
    //       <p>${replyMessage}</p>
    //       <p>Best regards,<br/>Team</p>
    //     `,
    //   });
    // }
    
    return NextResponse.json({
      success: true,
      message: "Message updated successfully!",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("❌ Error updating contact message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete contact message ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }
    
    const deleted = await Contact.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Message deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting contact message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Bulk update messages ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status, isRead } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Message IDs are required" },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;
    updateData.updated_at = new Date();
    
    const result = await Contact.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );
    
    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} messages updated successfully!`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error("❌ Error bulk updating messages:", error);
    return NextResponse.json(
      { error: "Failed to update messages" },
      { status: 500 }
    );
  }
}