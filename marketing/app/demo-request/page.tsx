"use client";
import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const initialState = {
  first_name: "",
  last_name: "",
  company: "",
  position: "",
  industry: "",
  email: "",
  phone: "",
  message: "",
};

export default function DemoRequestPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit request");
      setSuccess(true);
      setForm(initialState);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] via-[#e8eaf6] to-[#f3e7e9] px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Request a Demo</h1>
        <p className="text-gray-600 mb-8 text-center">Fill out the form below and our team will get in touch to schedule your personalized demo.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
            <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>
          <Input label="Company" name="company" value={form.company} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Position" name="position" value={form.position} onChange={handleChange} />
            <Input label="Industry" name="industry" value={form.industry} onChange={handleChange} />
          </div>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your needs..."
              value={form.message}
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Thank you! Your request has been received.</div>}
          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            {loading ? "Submitting..." : "Request a demo"}
          </Button>
        </form>
      </div>
    </div>
  );
} 