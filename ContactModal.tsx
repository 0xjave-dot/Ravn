import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, User, Mail, MessageSquare, Briefcase } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('3D Modeling');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);

    // Simulate clean server request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Save to local storage for realistic persistence
      const contacts = JSON.parse(localStorage.getItem('messages') || '[]');
      contacts.push({ name, email, category, message, date: new Date().toISOString() });
      localStorage.setItem('messages', JSON.stringify(contacts));

      // Reset fields
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-[#0C0C0C] border-l border-[#D7E2EA]/15 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto"
            style={{ boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#D7E2EA]/15">
              <h3 className="hero-heading font-black text-2xl uppercase tracking-wider">
                Start a Project
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-[#D7E2EA] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Form or Success */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 sm:gap-6"
                  >
                    <p className="text-[#D7E2EA]/70 text-sm sm:text-base leading-relaxed mb-2 font-light">
                      Have an interesting project space, client vision, or design inquiry? Describe what you want to build and let&apos;s create something outstanding.
                    </p>

                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white text-xs uppercase tracking-widest font-medium flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#BBCCD7]" /> Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-[#D7E2EA]/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm sm:text-base focus:outline-none focus:border-[#BBCCD7] focus:bg-white/10 transition-all font-sans"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white text-xs uppercase tracking-widest font-medium flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#BBCCD7]" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-[#D7E2EA]/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm sm:text-base focus:outline-none focus:border-[#BBCCD7] focus:bg-white/10 transition-all font-sans"
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white text-xs uppercase tracking-widest font-medium flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-[#BBCCD7]" /> I&apos;m interested in:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['3D Modeling', 'Rendering', 'Motion Design', 'Full Branding'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                              category === cat
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 text-[#D7E2EA] border-[#D7E2EA]/15 hover:bg-white/10'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white text-xs uppercase tracking-widest font-medium flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-[#BBCCD7]" /> Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        placeholder="Describe your vision, deadline, blockages..."
                        className="w-full bg-white/5 border border-[#D7E2EA]/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm sm:text-base focus:outline-none focus:border-[#BBCCD7] focus:bg-white/10 transition-all font-sans resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 relative rounded-xl font-bold uppercase tracking-widest text-[#0C0C0C] bg-[#D7E2EA] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all py-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-[#000] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <React.Fragment>
                          <Send className="w-4 h-4" /> Send Message
                        </React.Fragment>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <CheckCircle2 className="w-20 h-20 text-[#BBCCD7] mb-6 stroke-[1.5]" />
                    </motion.div>
                    <h4 className="hero-heading font-black text-3xl uppercase tracking-wider mb-3">
                      Sent!
                    </h4>
                    <p className="text-[#D7E2EA] font-light text-sm sm:text-base max-w-sm mb-8">
                      Thank you for contacting Raven! We have recorded your specifications and will respond or set up a review call within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        onClose();
                      }}
                      className="px-6 py-2.5 rounded-full border border-white text-white uppercase text-xs tracking-widest font-semibold hover:bg-white hover:text-black transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer metadata */}
            <div className="pt-6 border-t border-[#D7E2EA]/10 text-center">
              <p className="font-mono text-[10px] text-[#D7E2EA]/30 tracking-widest uppercase">
                Raven &copy; 2026 // Studio Portfolio
              </p>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
