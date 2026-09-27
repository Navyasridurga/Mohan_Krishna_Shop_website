import { useState } from 'react';
import CallButton from '../components/CallButton';
import WhatsAppButton from '../components/WhatsAppButton';
import MapButton from '../components/MapButton';
import { contactApi } from '../api/contactApi';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [state, setState] = useState({ submitting: false, error: null, success: false });

  async function handleSubmit(e) {
    e.preventDefault();
    setState({ submitting: true, error: null, success: false });
    try {
      await contactApi.sendMessage(form);
      setState({ submitting: false, error: null, success: true });
      setForm({ name: '', phone: '', message: '' });
    } catch (err) {
      setState({ submitting: false, error: err.message || 'Could not send your message.', success: false });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-teal-900 md:text-4xl">Contact Us</h1>
      <p className="mt-2 text-teal-800/80">Call, message us on WhatsApp, or send a note below.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <CallButton />
        <WhatsAppButton />
        <MapButton />
      </div>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-4 rounded-3xl bg-white p-6 shadow-card md:p-8">
        <div>
          <label className="text-sm font-semibold text-teal-900">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-teal-900">Phone (optional)</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-teal-900">Message</label>
          <textarea
            required
            minLength={5}
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
          />
        </div>

        {state.error && <p className="text-sm font-medium text-papaya-600">{state.error}</p>}
        {state.success && (
          <p className="text-sm font-medium text-lime-600">Thanks! We received your message and will get back to you.</p>
        )}

        <button type="submit" disabled={state.submitting} className="btn-primary justify-self-start">
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
