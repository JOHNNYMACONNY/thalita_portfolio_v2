"use client";

export default function ContactForm() {
    return (
        <form className="space-y-6" name="contact" method="POST" data-netlify="true">
            <input type="hidden" name="form-name" value="contact" />

            {/* Name Input */}
            <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-charcoal/70 ml-1">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full bg-white/60 border border-neutral-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-all duration-300 placeholder:text-neutral-400"
                    placeholder="Your full name"
                    required
                />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-charcoal/70 ml-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-white/60 border border-neutral-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-all duration-300 placeholder:text-neutral-400"
                    placeholder="example@email.com"
                    required
                />
            </div>

            {/* Phone Input (Optional) */}
            <div className="space-y-2">
                <label htmlFor="phone" className="text-xs uppercase tracking-widest font-bold text-charcoal/70 ml-1">
                    Phone <span className="text-neutral-400 font-normal lowercase tracking-normal">(optional)</span>
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full bg-white/60 border border-neutral-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-all duration-300 placeholder:text-neutral-400"
                    placeholder="+1 (555) 000-0000"
                />
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-charcoal/70 ml-1">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full bg-white/60 border border-neutral-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-all duration-300 placeholder:text-neutral-400 resize-none"
                    placeholder="Tell me about your project..."
                    required
                ></textarea>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-charcoal text-white font-heading text-xl py-4 rounded-lg hover:bg-magenta transition-colors duration-300 shadow-md hover:shadow-lg transform active:scale-[0.99]"
            >
                Send Message
            </button>
        </form>
    );
}
