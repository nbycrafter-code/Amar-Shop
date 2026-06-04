"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export const PageSet = () => {
  const { data: session, update } = useSession();
  const { language } = useLanguage();
  const isBn = language === "bn";
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: null as File | null,
  });
  const [image, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"personal" | "password">("personal");

  // Translations
  const texts = {
    loading: isBn ? "প্রোফাইল লোড হচ্ছে..." : "Loading profile...",
    saving: isBn ? "সেভ হচ্ছে..." : "Saving...",
    changesSaved: isBn ? "পরিবর্তন সফলভাবে সেভ হয়েছে!" : "Changes saved successfully!",
    yourDetailsUpdated: isBn ? "আপনার অ্যাকাউন্টের বিবরণ আপডেট করা হয়েছে।" : "Your account details have been updated.",
    error: isBn ? "এরর!" : "Error!",
    profilePicture: isBn ? "প্রোফাইল ছবি" : "Profile Picture",
    clickToChange: isBn ? "ছবি পরিবর্তন করতে ক্যামেরা আইকনে ক্লিক করুন" : "Click the camera icon to change photo",
    upload: isBn ? "আপলোড" : "Upload",
    remove: isBn ? "সরান" : "Remove",
    personalInformation: isBn ? "ব্যক্তিগত তথ্য" : "Personal Information",
    passwordSecurity: isBn ? "পাসওয়ার্ড ও নিরাপত্তা" : "Password & Security",
    firstName: isBn ? "নামের প্রথম অংশ" : "First Name",
    lastName: isBn ? "নামের শেষ অংশ" : "Last Name",
    displayName: isBn ? "ডিসপ্লে নাম" : "Display Name",
    displayNameOptional: isBn ? "(ঐচ্ছিক)" : "(Optional)",
    displayNameHelp: isBn ? "যদি না সেট করা থাকে, আপনার প্রথম নাম ডিসপ্লে নাম হিসেবে ব্যবহার করা হবে" : "If not set, your first name will be used as display name",
    emailAddress: isBn ? "ইমেইল ঠিকানা" : "Email Address",
    emailNotChangeable: isBn ? "ইমেইল ঠিকানা পরিবর্তন করা যাবে না" : "Email address cannot be changed",
    phoneNumber: isBn ? "ফোন নম্বর" : "Phone Number",
    leaveBlank: isBn ? "পাসওয়ার্ড পরিবর্তন করতে না চাইলে ফাঁকা রাখুন।" : "Leave the password fields blank if you don't want to change your password.",
    currentPassword: isBn ? "বর্তমান পাসওয়ার্ড" : "Current Password",
    newPassword: isBn ? "নতুন পাসওয়ার্ড" : "New Password",
    confirmPassword: isBn ? "নতুন পাসওয়ার্ড নিশ্চিত করুন" : "Confirm New Password",
    weak: isBn ? "দুর্বল" : "Weak",
    fair: isBn ? "মাঝারি" : "Fair",
    strong: isBn ? "শক্তিশালী" : "Strong",
    passwordMatch: isBn ? "পাসওয়ার্ড মিলেছে" : "Passwords match",
    passwordNotMatch: isBn ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match",
    saveChanges: isBn ? "পরিবর্তন সেভ করুন" : "Save Changes",
    cancel: isBn ? "বাতিল" : "Cancel",
    failedToLoad: isBn ? "প্রোফাইল ডাটা লোড করতে ব্যর্থ হয়েছে" : "Failed to load profile data",
    passwordLengthError: isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters",
    confirmRemoveImage: isBn ? "আপনি কি আপনার প্রোফাইল ছবি মুছতে চান?" : "Are you sure you want to remove your profile picture?",
    selectValidImage: isBn ? "দয়া করে একটি বৈধ ইমেজ ফাইল নির্বাচন করুন (JPEG, PNG, WEBP, বা GIF)" : "Please select a valid image file (JPEG, PNG, WEBP, or GIF)",
    imageSizeError: isBn ? "ইমেজ সাইজ ৫MB এর কম হতে হবে" : "Image size must be less than 5MB",
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        displayName: data.displayName || "",
        email: data.email || "",
        phone: data.phone || "",
      }));

      if (data.image) {
        setProfileImage(data.image);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(texts.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError(texts.selectValidImage);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(texts.imageSizeError);
        return;
      }

      setFormData(prev => ({ ...prev, avatar: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!formData.avatar) return;

    try {
      setUploadingImage(true);
      setError("");

      const formDataToSend = new FormData();
      formDataToSend.append("image", formData.avatar);

      const response = await fetch("/api/user/profile-image", {
        method: "PUT",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          image: result.image,
        },
      });

      setProfileImage(result.image);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFormData(prev => ({ ...prev, avatar: null }));

    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          phone: formData.phone,
        },
      });

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError(texts.passwordNotMatch);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError(texts.passwordLengthError);
      return;
    }

    if (!formData.currentPassword && !formData.newPassword) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageDelete = async () => {
    if (!confirm(texts.confirmRemoveImage)) {
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const response = await fetch("/api/user/profile-image", {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete image");
      }

      setProfileImage(null);

      await update({
        ...session,
        user: {
          ...session?.user,
          image: null,
        },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

    } catch (err: any) {
      console.error("Error deleting image:", err);
      setError(err.message || "Failed to delete image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "personal") {
      await handleProfileUpdate();
    } else {
      await handlePasswordUpdate();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">{texts.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 order-2 lg:order-1 space-y-6">
      {/* Success Banner */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-5 py-4 flex items-center gap-3 animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-green-700 font-semibold text-sm">{texts.changesSaved}</p>
            <p className="text-green-600 text-xs">{texts.yourDetailsUpdated}</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-red-700 font-semibold text-sm">{texts.error}</p>
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Avatar Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">{texts.profilePicture}</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            {image ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md">
                <Image
                  src={image}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {(formData.displayName || formData.firstName || formData.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-800 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                onChange={handleFileSelect}
              />
            </label>
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {formData.displayName || formData.firstName || formData.email?.split("@")[0] || "User"}
            </p>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <p className="text-xs text-gray-400">{texts.clickToChange}</p>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {uploadingImage ? texts.saving : texts.upload}
                </button>
              )}
              {image && (
                <button
                  type="button"
                  onClick={handleImageDelete}
                  disabled={uploadingImage}
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  {texts.remove}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "personal"
              ? "text-red-500 border-b-2 border-red-500 bg-red-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            {texts.personalInformation}
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "password"
              ? "text-red-500 border-b-2 border-red-500 bg-red-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            {texts.passwordSecurity}
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6">
          {activeTab === "personal" ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {texts.firstName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 transition-colors"
                    placeholder={isBn ? "নামের প্রথম অংশ লিখুন" : "Enter first name"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {texts.lastName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 transition-colors"
                    placeholder={isBn ? "নামের শেষ অংশ লিখুন" : "Enter last name"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {texts.displayName} <span className="text-gray-400 text-xs font-normal">{texts.displayNameOptional}</span>
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 transition-colors"
                  placeholder={isBn ? "ওয়েবসাইটে যেভাবে দেখা যাবে" : "How it will appear on website"}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {texts.displayNameHelp}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {texts.emailAddress} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {texts.emailNotChangeable}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {texts.phoneNumber}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 transition-colors"
                  placeholder={isBn ? "ফোন নম্বর লিখুন" : "Enter phone number"}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-yellow-700">
                  {texts.leaveBlank}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{texts.currentPassword}</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 transition-colors"
                    placeholder={isBn ? "বর্তমান পাসওয়ার্ড লিখুন" : "Enter current password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{texts.newPassword}</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 transition-colors"
                    placeholder={isBn ? "নতুন পাসওয়ার্ড লিখুন" : "Enter new password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${formData.newPassword.length >= i * 2
                            ? formData.newPassword.length >= 8
                              ? "bg-green-500"
                              : formData.newPassword.length >= 6
                                ? "bg-yellow-500"
                                : "bg-red-400"
                            : "bg-gray-200"
                            }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {formData.newPassword.length < 6
                        ? texts.weak
                        : formData.newPassword.length < 8
                          ? texts.fair
                          : texts.strong}{" "}
                      password
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{texts.confirmPassword}</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pr-10 border-2 rounded-lg text-sm outline-none transition-colors ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                      ? "border-red-400 bg-red-50"
                      : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                        ? "border-green-400"
                        : "border-gray-200 focus:border-red-400"
                      }`}
                    placeholder={isBn ? "নতুন পাসওয়ার্ড নিশ্চিত করুন" : "Confirm new password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{texts.passwordNotMatch}</p>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                  <p className="text-xs text-green-500 mt-1">✓ {texts.passwordMatch}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? texts.saving : texts.saveChanges}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors"
            >
              {texts.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageSet;