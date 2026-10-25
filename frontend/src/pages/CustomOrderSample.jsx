import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useGoldRate } from '../context/GoldRateContext';
import { UploadCloud, CheckCircle, Sparkles, Scale, IndianRupee, MessageCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function CustomOrderSample() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings, rates } = useGoldRate();

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    city: '',
    preferredMetal: '22K Yellow Gold',
    targetWeightGrams: searchParams.get('weight') || '',
    targetBudgetINR: '',
    notes: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle image selection
  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds 10MB. Please select a smaller photo.');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName || !formData.phoneNumber) {
      setErrorMessage('Please enter your name and WhatsApp contact number.');
      return;
    }

    if (!selectedFile && !imagePreview) {
      setErrorMessage('Please upload a photo of the jewellery design or sample piece you want made.');
      return;
    }

    try {
      setSubmitting(true);
      let uploadedImageUrl = imagePreview;

      // Upload image to backend
      if (selectedFile) {
        setUploading(true);
        const uploadRes = await api.uploadSampleImage(selectedFile);
        uploadedImageUrl = uploadRes.url;
        setUploading(false);
      }

      // Submit sample request
      const payload = {
        ...formData,
        targetWeightGrams: formData.targetWeightGrams ? parseFloat(formData.targetWeightGrams) : null,
        targetBudgetINR: formData.targetBudgetINR ? parseFloat(formData.targetBudgetINR) : null,
        sampleImageUrl: uploadedImageUrl,
      };

      const result = await api.submitCustomSample(payload);
      setSubmittedData({ ...result, sampleImageUrl: uploadedImageUrl });
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Failed to submit your design sample. Please try again.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  const whatsapp = settings?.whatsappNumber || '919876543210';

  return (
    <div className="min-h-screen bg-ivory py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-gold-100 text-burgundy-900 border border-gold-300 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2.5 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span>Bespoke Karigari & Custom Orders</span>
          </div>
          <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold text-burgundy-950">
            Send Us Your Jewellery Design Sample
          </h1>
          <p className="text-stone-600 text-xs sm:text-base max-w-xl mx-auto mt-2 leading-relaxed">
            Have a photo from Instagram, Pinterest, or a family heirloom? Upload your reference image below, and our master goldsmiths will provide an exact quotation and weight feasibility.
          </p>
        </div>

        {submittedData ? (
          /* Success Screen */
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gold-300 shadow-luxury text-center space-y-5 sm:space-y-6 animate-fade-in">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-950">
                Design Sample Received Successfully!
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Thank you, <strong>{submittedData.customerName}</strong>. Our chief karigari consultant is reviewing your sample image and estimated weight requirements.
              </p>
            </div>

            {/* Preview of Submitted Sample */}
            <div className="bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-200 max-w-sm mx-auto text-left flex items-center gap-3 sm:gap-4">
              <img
                src={submittedData.sampleImageUrl}
                alt="Submitted Sample"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-stone-300 shrink-0"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-burgundy-950 block">{submittedData.preferredMetal}</span>
                {submittedData.targetWeightGrams && (
                  <span className="text-stone-600 block">Target Weight: {submittedData.targetWeightGrams}g</span>
                )}
                {submittedData.targetBudgetINR && (
                  <span className="text-stone-600 block">Budget: ₹{submittedData.targetBudgetINR?.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>

            {/* Direct WhatsApp Follow-up */}
            <div className="pt-2 max-w-md mx-auto space-y-3">
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20just%20submitted%20a%20custom%20design%20sample%20on%20your%20website%20under%20the%20name%20"${encodeURIComponent(submittedData.customerName)}"%20(${submittedData.phoneNumber}).%20Preferred%20metal:%20${encodeURIComponent(submittedData.preferredMetal)}.%20Reference%20photo:%20${encodeURIComponent(submittedData.sampleImageUrl)}.%20Please%20share%20quotation.`}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Chat with Goldsmith on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
                className="text-xs text-stone-500 hover:text-burgundy-900 underline py-2 min-h-[36px]"
              >
                Submit another sample design
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border border-gold-300 shadow-luxury space-y-6 sm:space-y-8">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Photo Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-serif font-bold text-burgundy-950 mb-2">
                1. Upload Jewellery Reference Photo / Screenshot *
              </label>
              <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 border-2 border-dashed border-gold-300 rounded-2xl hover:border-gold-500 transition bg-gold-50/20">
                {imagePreview ? (
                  <div className="text-center space-y-3">
                    <img
                      src={imagePreview}
                      alt="Sample Preview"
                      className="mx-auto h-40 w-40 sm:h-48 sm:w-48 object-cover rounded-xl shadow border border-gold-200"
                    />
                    <div className="flex justify-center gap-3">
                      <label className="cursor-pointer text-xs font-semibold text-burgundy-900 bg-white border border-stone-300 px-3 py-1.5 rounded-lg hover:bg-stone-50 min-h-[36px] flex items-center">
                        Change Photo
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 px-2 py-1 min-h-[36px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <UploadCloud className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gold-500" />
                    <div className="flex text-xs sm:text-sm text-stone-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-semibold text-burgundy-900 hover:text-gold-600 focus-within:outline-none px-1">
                        <span>Click to upload photo</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <p className="pl-1 hidden xs:inline">or drag & drop</p>
                    </div>
                    <p className="text-[11px] sm:text-xs text-stone-400">
                      PNG, JPG, or WebP from mobile camera or gallery (up to 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Metal & Specifications */}
            <div className="space-y-4">
              <label className="block text-xs sm:text-sm font-serif font-bold text-burgundy-950">
                2. Desired Specifications
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {/* Preferred Metal */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Preferred Metal & Purity
                  </label>
                  <select
                    value={formData.preferredMetal}
                    onChange={(e) => setFormData({ ...formData, preferredMetal: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
                  >
                    <option value="22K Yellow Gold">22K Yellow Gold (916 BIS)</option>
                    <option value="18K Diamond Jewellery">18K Gold (Natural Diamonds)</option>
                    <option value="18K Rose Gold">18K Rose Gold</option>
                    <option value="18K White Gold">18K White Gold</option>
                    <option value="24K Pure Gold">24K Pure Gold</option>
                    <option value="925 Sterling Silver">925 Sterling Silver</option>
                  </select>
                </div>

                {/* Target Weight in Grams */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Target Weight (approx. g)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 25"
                      value={formData.targetWeightGrams}
                      onChange={(e) => setFormData({ ...formData, targetWeightGrams: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-stone-400 font-semibold">grams</span>
                  </div>
                </div>

                {/* Target Budget INR */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Approx. Budget (₹ INR)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="5000"
                      placeholder="e.g. 150000"
                      value={formData.targetBudgetINR}
                      onChange={(e) => setFormData({ ...formData, targetBudgetINR: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-stone-400 font-semibold">₹</span>
                  </div>
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Design Notes & Preferences
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention ring size, chain length, gemstone preferences, or if you need matching earrings..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900"
                ></textarea>
              </div>
            </div>

            {/* Step 3: Customer Contact Information */}
            <div className="space-y-4">
              <label className="block text-xs sm:text-sm font-serif font-bold text-burgundy-950">
                3. Your Contact Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Pune, Surat"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-base sm:text-sm focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 sm:pt-4 border-t border-stone-200">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full min-h-[48px] bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 hover:from-burgundy-900 hover:to-burgundy-800 text-gold-300 font-bold py-3.5 sm:py-4 px-6 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-luxury disabled:opacity-50"
              >
                {submitting || uploading ? (
                  <span>Uploading & Submitting Sample...</span>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-gold-400 shrink-0" />
                    <span>Submit Design Sample for Quotation</span>
                  </>
                )}
              </button>
              <p className="text-[10px] sm:text-[11px] text-center text-stone-400 mt-2">
                🔒 Your reference images and contact information are kept strictly confidential.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
