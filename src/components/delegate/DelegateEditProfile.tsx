'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { calculateProfileCompletion } from '../../lib/mockData';
import {
  getStoredProfileImage,
  saveStoredProfileImage,
  removeStoredProfileImage,
  compressImageFile,
} from '../../lib/profileImageStorage';
import { ArrowLeft, Camera, Loader2, Lock, Save } from 'lucide-react';

export const DelegateEditProfile: React.FC = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser, updateCurrentUser, showToast } = useStore();
  
  const isPlaceholderDesignation = (d?: string) => {
    if (!d) return true;
    const lower = d.trim().toLowerCase();
    return lower === 'delegate' || lower === 'summit attendee' || lower === 'attendee' || lower === 'participant';
  };

  const isPlaceholderCompany = (c?: string) => {
    if (!c) return true;
    const lower = c.trim().toLowerCase();
    return lower === 'summit attendee' || lower === 'mpss 2026' || lower === 'mpss26' || lower === 'delegate' || lower === 'attendee';
  };

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    designation: isPlaceholderDesignation(currentUser.designation) ? '' : (currentUser.designation || ''),
    company: isPlaceholderCompany(currentUser.company) ? '' : (currentUser.company || ''),
    bio: currentUser.bio || '',
    linkedin: currentUser.linkedin || '',
    twitter: currentUser.twitter || '',
    email: currentUser.email || '',
    mobile: currentUser.mobile && currentUser.mobile !== 'Not listed' ? currentUser.mobile : '',
    avatar: currentUser.avatar || '',
  });

  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync profile data and avatar when currentUser updates
  useEffect(() => {
    const userEmail = currentUser?.email;
    if (userEmail) {
      const storedImage = getStoredProfileImage(userEmail);
      if (storedImage) {
        setFormData((prev) => ({
          ...prev,
          avatar: storedImage,
          name: prev.name || currentUser?.name || '',
          designation: prev.designation ? prev.designation : (isPlaceholderDesignation(currentUser?.designation) ? '' : (currentUser?.designation || '')),
          company: prev.company ? prev.company : (isPlaceholderCompany(currentUser?.company) ? '' : (currentUser?.company || '')),
          email: currentUser?.email || prev.email,
        }));
        return;
      }
    }
    // If no stored image for this specific email, fallback to default/initial avatar
    setFormData((prev) => ({
      ...prev,
      avatar: currentUser?.avatar || '',
      name: prev.name || currentUser?.name || '',
      designation: prev.designation ? prev.designation : (isPlaceholderDesignation(currentUser?.designation) ? '' : (currentUser?.designation || '')),
      company: prev.company ? prev.company : (isPlaceholderCompany(currentUser?.company) ? '' : (currentUser?.company || '')),
      email: currentUser?.email || prev.email,
    }));
  }, [currentUser?.email, currentUser?.avatar, currentUser?.designation, currentUser?.company, currentUser?.name]);

  const completionPercentage = calculateProfileCompletion(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Processes uploaded photo using HTML5 Canvas, compresses to <=300x300 at 0.7 quality,
   * and saves to email-scoped localStorage without making any database/API calls.
   */
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userEmail = currentUser?.email;
    if (!userEmail) {
      showToast('Please log in with a valid email address to save a profile photo.', 'error');
      return;
    }

    // Reset input so user can choose the same file again if desired
    e.target.value = '';

    setIsProcessingPhoto(true);
    try {
      // 1. Resize and compress via HTML5 Canvas (max 300x300, 0.7 quality WebP/JPEG)
      const compressedBase64 = await compressImageFile(file, 300, 300, 0.7);

      // 2. Save to email-scoped localStorage key (e.g. profile_image_user@domain.com)
      const saveResult = saveStoredProfileImage(userEmail, compressedBase64);
      if (!saveResult.success) {
        showToast(saveResult.error || 'Failed to save image to browser storage.', 'error');
        return;
      }

      // 3. Immediately update UI state without making any database/API upload calls
      setFormData((prev) => ({ ...prev, avatar: compressedBase64 }));
      setCurrentUser((prev) => ({ ...prev, avatar: compressedBase64 }));

      showToast('Profile photo updated ✓', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to process image. Please try another file.', 'error');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  /**
   * Removes the profile photo from email-scoped localStorage and resets the avatar state.
   */
  const handleRemovePhoto = () => {
    const userEmail = currentUser?.email;
    if (userEmail) {
      removeStoredProfileImage(userEmail);
    }
    setFormData((prev) => ({ ...prev, avatar: '' }));
    setCurrentUser((prev) => ({ ...prev, avatar: '' }));
    showToast('Profile photo removed', 'info');
  };

  /**
   * Saves text fields to backend profile, excluding large Base64 avatar payload.
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Exclude base64 avatar from backend API payload (avatar is managed locally via localStorage)
      const { avatar, ...profileFields } = formData;
      // Optimistically update store and trigger background sync
      const savePromise = updateCurrentUser(profileFields);
      // Immediately navigate back for instant UX
      router.push('/delegate/profile');
      await savePromise;
    } catch {
      // error toast handled by store
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F6F4F0] flex flex-col relative h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-3 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/delegate/profile')}
            className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#181818]" />
          </button>
          <h1 className="text-[15px] font-bold text-[#181818] tracking-tight">Edit Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isProcessingPhoto}
          className="bg-[#181818] hover:bg-[#333] text-white text-[11.5px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-3 pb-4 overflow-y-auto space-y-3">
        
        {/* Compact Profile Completion */}
        <div className="bg-white py-2 px-3 rounded-[12px] border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="text-[#6B6B6B] uppercase tracking-wider text-[10px]">Profile Completion</span>
            <span className={completionPercentage === 100 ? "text-[#16A34A] font-bold" : "text-[#181818]"}>
              {completionPercentage}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                completionPercentage === 100 ? 'bg-[#16A34A]' : 'bg-[#181818]'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Centered Compact Profile Photo */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="relative">
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt="Profile Preview" 
                className="w-16 h-16 rounded-full object-cover border border-[#DEDCD7] shadow-xs" 
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#F6F4F0] border border-[#DEDCD7] text-[#181818] flex items-center justify-center font-bold text-lg shadow-xs">
                {formData.name ? formData.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) : '?'}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#181818] hover:bg-[#333] text-white rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer">
              {isProcessingPhoto ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={isProcessingPhoto}
                onChange={handlePhotoUpload} 
              />
            </label>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[12px]">
            <label className="font-semibold text-[#181818] hover:underline cursor-pointer">
              {isProcessingPhoto ? 'Compressing...' : 'Change Photo'}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={isProcessingPhoto}
                onChange={handlePhotoUpload} 
              />
            </label>
            {formData.avatar && (
              <>
                <span className="text-[#D1D5DB]">·</span>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isProcessingPhoto}
                  className="font-medium text-[#DC2626] hover:underline cursor-pointer disabled:opacity-50"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-3 rounded-[14px] border border-[#E5E7EB] shadow-xs space-y-2.5">
          <h2 className="text-[12.5px] font-bold text-[#181818] border-b border-[#F3F4F6] pb-2">Basic Info</h2>
          
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-[#6B6B6B]">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Hari Gupta"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#DEDCD7] text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#181818]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-[#6B6B6B]">Designation / Job Title</label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. CEO"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#DEDCD7] text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#181818]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-[#6B6B6B]">Company Name</label>
            <input
              type="text"
              name="company"
              placeholder="e.g. GetMyEvent"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#DEDCD7] text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#181818]"
            />
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-white p-3 rounded-[14px] border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="border-b border-[#F3F4F6] pb-2">
            <h2 className="text-[12.5px] font-bold text-[#181818]">Contact & Social Information</h2>
            <p className="text-[11px] text-[#6B6B6B] mt-0.5">
              Add your contact details and LinkedIn to connect with attendees.
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11.5px] font-semibold text-[#181818]">Email Address</label>
              <span className="text-[10px] font-medium text-[#71717A] flex items-center gap-1 bg-[#F4F4F5] px-1.5 py-0.5 rounded border border-[#E4E4E7]">
                <Lock className="w-2.5 h-2.5 text-[#71717A]" />
                Registered
              </span>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              disabled
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[12.5px] text-[#6B7280] font-medium cursor-not-allowed select-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-[#181818]">
              Mobile Number <span className="text-[10px] font-normal text-[#9CA3AF]">(Optional)</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#DEDCD7] text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#181818]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-[#181818]">
              LinkedIn Profile <span className="text-[10px] font-normal text-[#9CA3AF]">(Optional)</span>
            </label>
            <input
              type="text"
              name="linkedin"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-[#DEDCD7] text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#181818]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
