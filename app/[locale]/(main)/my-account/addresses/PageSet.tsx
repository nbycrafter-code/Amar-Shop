"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Address {
  id?: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone: string;
  email?: string;
  isDefault?: boolean;
}

interface PageSetProps {
  settings?: any; // settings prop যোগ করা হলো
}

// AddressForm component - moved outside to prevent re-renders
const AddressForm = memo(({ 
  address, 
  onChange, 
  onSave, 
  onCancel, 
  isSaving,
  showEmail = false,
  formError = "",
  texts,
  settings = {} // settings prop যোগ করা হলো
}: { 
  address: Address;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  showEmail?: boolean;
  formError?: string;
  texts: any;
  settings?: any;
}) => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  
  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const borderColor = settings?.borderColor || "#D1D5DB";
  const focusRingColor = primaryColor;

  const countryOptions = [
    { value: "Bangladesh", labelEn: "Bangladesh", labelBn: "বাংলাদেশ" },
    { value: "India", labelEn: "India", labelBn: "ভারত" },
    { value: "USA", labelEn: "USA", labelBn: "যুক্তরাষ্ট্র" },
    { value: "UK", labelEn: "UK", labelBn: "যুক্তরাজ্য" },
    { value: "Canada", labelEn: "Canada", labelBn: "কানাডা" },
    { value: "Australia", labelEn: "Australia", labelBn: "অস্ট্রেলিয়া" },
  ];

  return (
    <div className="space-y-4">
      {formError && (
        <div 
          className="p-3 rounded-lg text-sm"
          style={{ backgroundColor: `${settings?.errorColor || '#EF4444'}10`, border: `1px solid ${settings?.errorColor || '#EF4444'}20`, color: settings?.errorColor || '#EF4444' }}
        >
          {formError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
          {texts.fullName} <span style={{ color: settings?.errorColor || '#EF4444' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={address.name || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
          style={{ borderColor: borderColor }}
          onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
          onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
          placeholder={isBn ? "আপনার পূর্ণ নাম লিখুন" : "Enter your full name"}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
          {texts.addressLine} <span style={{ color: settings?.errorColor || '#EF4444' }}>*</span>
        </label>
        <textarea
          name="address"
          value={address.address || ""}
          onChange={onChange}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
          style={{ borderColor: borderColor }}
          onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
          onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
          placeholder={isBn ? "বাড়ির নম্বর, রাস্তা, এলাকা" : "House number, street, area"}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
            {texts.city} <span style={{ color: settings?.errorColor || '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            name="city"
            value={address.city || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
            style={{ borderColor: borderColor }}
            onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
            onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
            placeholder={isBn ? "শহর" : "City"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
            {texts.state}
          </label>
          <input
            type="text"
            name="state"
            value={address.state || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
            style={{ borderColor: borderColor }}
            onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
            onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
            placeholder={isBn ? "রাজ্য/জেলা" : "State/District"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
            {texts.zipCode}
          </label>
          <input
            type="text"
            name="zipCode"
            value={address.zipCode || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
            style={{ borderColor: borderColor }}
            onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
            onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
            placeholder={isBn ? "পোস্ট কোড" : "Zip Code"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
            {texts.country}
          </label>
          <select
            name="country"
            value={address.country || "Bangladesh"}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
            style={{ borderColor: borderColor }}
            onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
            onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
          >
            {countryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {isBn ? option.labelBn : option.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
          {texts.phone} <span style={{ color: settings?.errorColor || '#EF4444' }}>*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={address.phone || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
          style={{ borderColor: borderColor }}
          onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
          onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
          placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
        />
      </div>

      {showEmail && (
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: settings?.textColor || '#374151' }}>
            {texts.email}
          </label>
          <input
            type="email"
            name="email"
            value={address.email || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg outline-none transition-all"
            style={{ borderColor: borderColor }}
            onFocus={(e) => e.currentTarget.style.borderColor = focusRingColor}
            onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
            placeholder="example@email.com"
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          style={{ backgroundColor: primaryColor }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.buttonPrimaryHover || '#d4382c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
        >
          {isSaving ? (isBn ? "সেভ হচ্ছে..." : "Saving...") : texts.save}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg transition-all cursor-pointer"
          style={{ borderColor: borderColor, color: settings?.textColor || '#374151', backgroundColor: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.hoverBackground || '#F9FAFB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          {texts.cancel}
        </button>
      </div>
    </div>
  );
});

AddressForm.displayName = "AddressForm";

// AddressDisplay component - moved outside
const AddressDisplay = memo(({ 
  address, 
  onEdit,
  isEmptyMessage,
  texts,
  isBn,
  settings = {} // settings prop যোগ করা হলো
}: { 
  address: Address | null;
  onEdit: () => void;
  isEmptyMessage: string;
  texts: any;
  isBn: boolean;
  settings?: any;
}) => {
  const hasAddress = address?.name && address?.address && address?.city;
  
  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";

  const countryOptions = [
    { value: "Bangladesh", labelEn: "Bangladesh", labelBn: "বাংলাদেশ" },
    { value: "India", labelEn: "India", labelBn: "ভারত" },
    { value: "USA", labelEn: "USA", labelBn: "যুক্তরাষ্ট্র" },
    { value: "UK", labelEn: "UK", labelBn: "যুক্তরাজ্য" },
    { value: "Canada", labelEn: "Canada", labelBn: "কানাডা" },
    { value: "Australia", labelEn: "Australia", labelBn: "অস্ট্রেলিয়া" },
  ];

  const getCountryDisplay = (countryValue: string) => {
    const country = countryOptions.find(c => c.value === countryValue);
    if (country) {
      return isBn ? country.labelBn : country.labelEn;
    }
    return countryValue;
  };

  if (!hasAddress) {
    return (
      <div 
        className="border border-dashed p-4 rounded text-sm flex items-center justify-center h-32"
        style={{ borderColor: borderColor, color: textMuted }}
      >
        {isEmptyMessage}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded text-sm space-y-1" style={{ borderColor: borderColor }}>
      <p className="font-medium" style={{ color: textColor }}>{address.name}</p>
      <p style={{ color: textMuted }}>{address.address}</p>
      <p style={{ color: textMuted }}>
        {address.city}
        {address.state && `, ${address.state}`}
        {address.zipCode && ` - ${address.zipCode}`}
      </p>
      <p style={{ color: textMuted }}>{getCountryDisplay(address.country)}</p>
      <p style={{ color: textMuted }}>{address.phone}</p>
      {address.email && <p style={{ color: primaryColor }}>{address.email}</p>}
      <button
        onClick={onEdit}
        className="text-xs hover:underline mt-2"
        style={{ color: primaryColor }}
      >
        {texts.edit}
      </button>
    </div>
  );
});

AddressDisplay.displayName = "AddressDisplay";

export const PageSet = ({ settings = {} }: PageSetProps) => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const { data: session, update } = useSession();
  const router = useRouter();

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const successColor = settings?.successColor || "#10B981";
  const errorColor = settings?.errorColor || "#EF4444";

  const [originalBilling, setOriginalBilling] = useState<Address | null>(null);
  const [originalShipping, setOriginalShipping] = useState<Address | null>(null);
  
  const [formBilling, setFormBilling] = useState<Address>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    phone: "",
    email: "",
  });

  const [formShipping, setFormShipping] = useState<Address>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    phone: "",
    email: "",
  });

  const [editingType, setEditingType] = useState<"billing" | "shipping" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Translations
  const texts = {
    description: isBn
      ? "নিম্নলিখিত ঠিকানাগুলি চেকআউট পৃষ্ঠায় ডিফল্ট হিসাবে ব্যবহার করা হবে।"
      : "The following addresses will be used on the checkout page by default.",
    billingAddress: isBn ? "বিলিং ঠিকানা" : "Billing address",
    shippingAddress: isBn ? "ডেলিভারি ঠিকানা" : "Shipping address",
    edit: isBn ? "এডিট" : "Edit",
    save: isBn ? "সেভ করুন" : "Save",
    cancel: isBn ? "বাতিল" : "Cancel",
    noShippingAddress: isBn
      ? "কোন ডেলিভারি ঠিকানা সেট করা নেই।"
      : "No shipping address set.",
    noBillingAddress: isBn
      ? "কোন বিলিং ঠিকানা সেট করা নেই।"
      : "No billing address set.",
    fullName: isBn ? "পূর্ণ নাম" : "Full Name",
    addressLine: isBn ? "ঠিকানা" : "Address",
    city: isBn ? "শহর" : "City",
    state: isBn ? "রাজ্য/জেলা" : "State/District",
    zipCode: isBn ? "পোস্ট কোড" : "Zip Code",
    country: isBn ? "দেশ" : "Country",
    phone: isBn ? "মোবাইল নম্বর" : "Phone Number",
    email: isBn ? "ইমেইল" : "Email",
    saveSuccess: isBn ? "ঠিকানা সফলভাবে সেভ হয়েছে!" : "Address saved successfully!",
    saveError: isBn ? "ঠিকানা সেভ করতে ব্যর্থ হয়েছে" : "Failed to save address",
    loading: isBn ? "লোড হচ্ছে..." : "Loading...",
    fillRequired: isBn ? "দয়া করে প্রয়োজনীয় সকল তথ্য পূরণ করুন" : "Please fill all required fields",
  };

  // Handle billing form changes
  const handleBillingChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormBilling(prev => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  // Handle shipping form changes
  const handleShippingChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormShipping(prev => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  // Fetch addresses on load
  const fetchAddresses = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/addresses");
      const data = await response.json();

      if (data.success) {
        if (data.billingAddress) {
          setOriginalBilling(data.billingAddress);
          setFormBilling(data.billingAddress);
        }
        if (data.shippingAddress) {
          setOriginalShipping(data.shippingAddress);
          setFormShipping(data.shippingAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Update session cookie after address change
  const updateSessionAddresses = useCallback(async (billingAddr: Address | null, shippingAddr: Address | null) => {
    try {
      await update({
        ...session,
        billingAddress: billingAddr,
        shippingAddress: shippingAddr,
      });
      
      router.refresh();
    } catch (error) {
      console.error("Error updating session addresses:", error);
    }
  }, [session, update, router]);

  // Handle save address
  const handleSave = useCallback(async (type: "billing" | "shipping") => {
    setIsSaving(true);
    const address = type === "billing" ? formBilling : formShipping;

    if (!address.name || !address.address || !address.city || !address.phone) {
      toast.error(texts.fillRequired);
      setError(texts.fillRequired);
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, address }),
      });

      const data = await response.json();

      if (data.success) {
        let newBilling = originalBilling;
        let newShipping = originalShipping;
        
        if (type === "billing") {
          newBilling = formBilling;
          setOriginalBilling(formBilling);
        } else {
          newShipping = formShipping;
          setOriginalShipping(formShipping);
        }
        
        // Update session cookie with new addresses
        await updateSessionAddresses(newBilling, newShipping);
        
        toast.success(texts.saveSuccess);
        setSaved(true);
        setEditingType(null);
        setError("");
        
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(data.error || texts.saveError);
        setError(data.error || texts.saveError);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(texts.saveError);
      setError(texts.saveError);
    } finally {
      setIsSaving(false);
    }
  }, [formBilling, formShipping, originalBilling, originalShipping, texts, updateSessionAddresses]);

  // Handle cancel edit
  const handleCancel = useCallback(() => {
    if (editingType === "billing" && originalBilling) {
      setFormBilling(originalBilling);
    } else if (editingType === "shipping" && originalShipping) {
      setFormShipping(originalShipping);
    }
    setEditingType(null);
    setError("");
  }, [editingType, originalBilling, originalShipping]);

  // Start editing
  const startEditing = useCallback((type: "billing" | "shipping") => {
    if (type === "billing" && originalBilling) {
      setFormBilling(originalBilling);
    } else if (type === "shipping" && originalShipping) {
      setFormShipping(originalShipping);
    } else {
      const emptyAddress = {
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Bangladesh",
        phone: "",
        email: "",
      };
      if (type === "billing") {
        setFormBilling(emptyAddress);
      } else {
        setFormShipping(emptyAddress);
      }
    }
    setEditingType(type);
    setError("");
  }, [originalBilling, originalShipping]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderBottomColor: primaryColor }}
          />
          <p className="mt-4" style={{ color: textMuted }}>{texts.loading}</p>
        </div>
      </div>
    );
  }

  const displayBilling = editingType === "billing" ? formBilling : originalBilling;
  const displayShipping = editingType === "shipping" ? formShipping : originalShipping;

  return (
    <div className="flex-1">
      {/* Success Message */}
      {saved && (
        <div 
          className="mb-4 p-4 rounded-lg text-sm flex items-center gap-2"
          style={{ backgroundColor: `${successColor}10`, border: `1px solid ${successColor}20`, color: successColor }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {texts.saveSuccess}
        </div>
      )}

      <p className="text-sm mb-6" style={{ color: textMuted }}>{texts.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Billing Address */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: textColor }}>{texts.billingAddress}</h3>
            {editingType !== "billing" && (
              <button
                onClick={() => startEditing("billing")}
                className="text-xs hover:underline cursor-pointer"
                style={{ color: primaryColor }}
              >
                {texts.edit}
              </button>
            )}
          </div>

          {editingType === "billing" ? (
            <AddressForm
              address={formBilling}
              onChange={handleBillingChange}
              onSave={() => handleSave("billing")}
              onCancel={handleCancel}
              isSaving={isSaving}
              showEmail={true}
              formError={error}
              texts={texts}
              settings={settings}
            />
          ) : (
            <AddressDisplay
              address={displayBilling}
              onEdit={() => startEditing("billing")}
              isEmptyMessage={texts.noBillingAddress}
              texts={texts}
              isBn={isBn}
              settings={settings}
            />
          )}
        </div>

        {/* Shipping Address */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: textColor }}>{texts.shippingAddress}</h3>
            {editingType !== "shipping" && (
              <button
                onClick={() => startEditing("shipping")}
                className="text-xs hover:underline cursor-pointer"
                style={{ color: primaryColor }}
              >
                {texts.edit}
              </button>
            )}
          </div>

          {editingType === "shipping" ? (
            <AddressForm
              address={formShipping}
              onChange={handleShippingChange}
              onSave={() => handleSave("shipping")}
              onCancel={handleCancel}
              isSaving={isSaving}
              showEmail={false}
              formError={error}
              texts={texts}
              settings={settings}
            />
          ) : (
            <AddressDisplay
              address={displayShipping}
              onEdit={() => startEditing("shipping")}
              isEmptyMessage={texts.noShippingAddress}
              texts={texts}
              isBn={isBn}
              settings={settings}
            />
          )}
        </div>
      </div>
    </div>
  );
};