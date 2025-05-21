"use client";
import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const initialState = {
  first_name: "",
  last_name: "",
  company: "",
  position: "",
  email: "",
  comments: "",
};

export default function DemoRequestPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    <section className="container-dark lg:h-[var(--hero-height)] lg:overflow-hidden opacity-100">
      <div className="container-fluid flex flex-col md:flex-row gap-12 md:gap-10 md:items-center py-8 md:py-20">
        {/* Colonne gauche : texte, badge, bénéfices */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start text-pretty">
          <div className="flex flex-col gap-6 lg:max-w-[370px] items-center md:items-start lg:text-start" style={{opacity: 1, visibility: 'inherit'}}>
            <div className="w-fit inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs !leading-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-batch-bg text-w1 px-[8px] py-[6px]">Demo</div>
            <h1 className="large-title text-w1 text-center md:text-left">See Cortex in action</h1>
            <div className="body text-w2">
              <p className="body text-w2 text-center md:text-left">Cortex makes it easy for engineering organizations to gain visibility into their services and deliver high quality software.</p>
              <ul className="space-y-2 pt-4">
                <li className="flex items-start gap-2 [&>p]:text-start">
                  <div className="flex items-center justify-center h-5 w-5">
                    {/* SVG check icon */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13415 13.0003 9.06522 13.0464 8.98934 13.0779C8.91347 13.1093 8.83214 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51067 13.0779C8.43479 13.0464 8.36586 13.0003 8.30782 12.9422L6.43282 11.0672C6.31554 10.9499 6.24966 10.7909 6.24966 10.625C6.24966 10.4591 6.31554 10.3001 6.43282 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04086 9.99965 7.19992 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281ZM18.125 10C18.125 11.607 17.6485 13.1779 16.7557 14.514C15.8629 15.8502 14.594 16.8916 13.1093 17.5065C11.6247 18.1215 9.99099 18.2824 8.4149 17.9689C6.8388 17.6554 5.39106 16.8815 4.25476 15.7452C3.11846 14.6089 2.34463 13.1612 2.03112 11.5851C1.71762 10.009 1.87852 8.37535 2.49348 6.8907C3.10844 5.40605 4.14985 4.1371 5.486 3.24431C6.82214 2.35152 8.39303 1.875 10 1.875C12.1542 1.87727 14.2195 2.73403 15.7427 4.25727C17.266 5.78051 18.1227 7.84581 18.125 10ZM16.875 10C16.875 8.64025 16.4718 7.31104 15.7164 6.18045C14.9609 5.04987 13.8872 4.16868 12.631 3.64833C11.3747 3.12798 9.99238 2.99183 8.65876 3.2571C7.32514 3.52237 6.10013 4.17716 5.13864 5.13864C4.17716 6.10013 3.52238 7.32513 3.2571 8.65875C2.99183 9.99237 3.12798 11.3747 3.64833 12.6309C4.16868 13.8872 5.04987 14.9609 6.18046 15.7164C7.31105 16.4718 8.64026 16.875 10 16.875C11.8227 16.8729 13.5702 16.1479 14.8591 14.8591C16.1479 13.5702 16.8729 11.8227 16.875 10Z" fill="#B9B8BF"></path></svg>
                  </div>
                  <p className="body text-w2 text-center md:text-left">Understand and operate your services</p>
                </li>
                <li className="flex items-start gap-2 [&>p]:text-start">
                  <div className="flex items-center justify-center h-5 w-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13415 13.0003 9.06522 13.0464 8.98934 13.0779C8.91347 13.1093 8.83214 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51067 13.0779C8.43479 13.0464 8.36586 13.0003 8.30782 12.9422L6.43282 11.0672C6.31554 10.9499 6.24966 10.7909 6.24966 10.625C6.24966 10.4591 6.31554 10.3001 6.43282 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04086 9.99965 7.19992 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281ZM18.125 10C18.125 11.607 17.6485 13.1779 16.7557 14.514C15.8629 15.8502 14.594 16.8916 13.1093 17.5065C11.6247 18.1215 9.99099 18.2824 8.4149 17.9689C6.8388 17.6554 5.39106 16.8815 4.25476 15.7452C3.11846 14.6089 2.34463 13.1612 2.03112 11.5851C1.71762 10.009 1.87852 8.37535 2.49348 6.8907C3.10844 5.40605 4.14985 4.1371 5.486 3.24431C6.82214 2.35152 8.39303 1.875 10 1.875C12.1542 1.87727 14.2195 2.73403 15.7427 4.25727C17.266 5.78051 18.1227 7.84581 18.125 10ZM16.875 10C16.875 8.64025 16.4718 7.31104 15.7164 6.18045C14.9609 5.04987 13.8872 4.16868 12.631 3.64833C11.3747 3.12798 9.99238 2.99183 8.65876 3.2571C7.32514 3.52237 6.10013 4.17716 5.13864 5.13864C4.17716 6.10013 3.52238 7.32513 3.2571 8.65875C2.99183 9.99237 3.12798 11.3747 3.64833 12.6309C4.16868 13.8872 5.04987 14.9609 6.18046 15.7164C7.31105 16.4718 8.64026 16.875 10 16.875C11.8227 16.8729 13.5702 16.1479 14.8591 14.8591C16.1479 13.5702 16.8729 11.8227 16.875 10Z" fill="#B9B8BF"></path></svg>
                  </div>
                  <p className="body text-w2 text-center md:text-left">Set objective standards for service quality</p>
                </li>
                <li className="flex items-start gap-2 [&>p]:text-start">
                  <div className="flex items-center justify-center h-5 w-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13415 13.0003 9.06522 13.0464 8.98934 13.0779C8.91347 13.1093 8.83214 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51067 13.0779C8.43479 13.0464 8.36586 13.0003 8.30782 12.9422L6.43282 11.0672C6.31554 10.9499 6.24966 10.7909 6.24966 10.625C6.24966 10.4591 6.31554 10.3001 6.43282 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04086 9.99965 7.19992 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281ZM18.125 10C18.125 11.607 17.6485 13.1779 16.7557 14.514C15.8629 15.8502 14.594 16.8916 13.1093 17.5065C11.6247 18.1215 9.99099 18.2824 8.4149 17.9689C6.8388 17.6554 5.39106 16.8815 4.25476 15.7452C3.11846 14.6089 2.34463 13.1612 2.03112 11.5851C1.71762 10.009 1.87852 8.37535 2.49348 6.8907C3.10844 5.40605 4.14985 4.1371 5.486 3.24431C6.82214 2.35152 8.39303 1.875 10 1.875C12.1542 1.87727 14.2195 2.73403 15.7427 4.25727C17.266 5.78051 18.1227 7.84581 18.125 10ZM16.875 10C16.875 8.64025 16.4718 7.31104 15.7164 6.18045C14.9609 5.04987 13.8872 4.16868 12.631 3.64833C11.3747 3.12798 9.99238 2.99183 8.65876 3.2571C7.32514 3.52237 6.10013 4.17716 5.13864 5.13864C4.17716 6.10013 3.52238 7.32513 3.2571 8.65875C2.99183 9.99237 3.12798 11.3747 3.64833 12.6309C4.16868 13.8872 5.04987 14.9609 6.18046 15.7164C7.31105 16.4718 8.64026 16.875 10 16.875C11.8227 16.8729 13.5702 16.1479 14.8591 14.8591C16.1479 13.5702 16.8729 11.8227 16.875 10Z" fill="#B9B8BF"></path></svg>
                  </div>
                  <p className="body text-w2 text-center md:text-left">Establish ownership and accountability</p>
                </li>
                <li className="flex items-start gap-2 [&>p]:text-start">
                  <div className="flex items-center justify-center h-5 w-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13415 13.0003 9.06522 13.0464 8.98934 13.0779C8.91347 13.1093 8.83214 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51067 13.0779C8.43479 13.0464 8.36586 13.0003 8.30782 12.9422L6.43282 11.0672C6.31554 10.9499 6.24966 10.7909 6.24966 10.625C6.24966 10.4591 6.31554 10.3001 6.43282 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04086 9.99965 7.19992 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281ZM18.125 10C18.125 11.607 17.6485 13.1779 16.7557 14.514C15.8629 15.8502 14.594 16.8916 13.1093 17.5065C11.6247 18.1215 9.99099 18.2824 8.4149 17.9689C6.8388 17.6554 5.39106 16.8815 4.25476 15.7452C3.11846 14.6089 2.34463 13.1612 2.03112 11.5851C1.71762 10.009 1.87852 8.37535 2.49348 6.8907C3.10844 5.40605 4.14985 4.1371 5.486 3.24431C6.82214 2.35152 8.39303 1.875 10 1.875C12.1542 1.87727 14.2195 2.73403 15.7427 4.25727C17.266 5.78051 18.1227 7.84581 18.125 10ZM16.875 10C16.875 8.64025 16.4718 7.31104 15.7164 6.18045C14.9609 5.04987 13.8872 4.16868 12.631 3.64833C11.3747 3.12798 9.99238 2.99183 8.65876 3.2571C7.32514 3.52237 6.10013 4.17716 5.13864 5.13864C4.17716 6.10013 3.52238 7.32513 3.2571 8.65875C2.99183 9.99237 3.12798 11.3747 3.64833 12.6309C4.16868 13.8872 5.04987 14.9609 6.18046 15.7164C7.31105 16.4718 8.64026 16.875 10 16.875C11.8227 16.8729 13.5702 16.1479 14.8591 14.8591C16.1479 13.5702 16.8729 11.8227 16.875 10Z" fill="#B9B8BF"></path></svg>
                  </div>
                  <p className="body text-w2 text-center md:text-left">Drive org-wide progress in ongoing initiatives</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Colonne droite : formulaire */}
        <div className="w-full lg:w-1/2">
          <div className="relative box-border">
            {/* Bordures décoratives */}
            <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[160%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(229,229,229,0.2)_10%,rgba(229,229,229,0.2)_90%] to-transparent hidden md:block"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(229,229,229,0.2)_10%,rgba(229,229,229,0.2)_90%] to-transparent hidden md:block"></div>
            <div className="absolute top-1/2 -left-[2px] -translate-y-1/2 w-[1px] h-[160%] bg-gradient-to-b from-transparent via-[rgba(229,229,229,0.2)_10%,rgba(229,229,229,0.2)_90%] to-transparent hidden md:block"></div>
            <div className="absolute top-1/2 -right-[2px] -translate-y-1/2 w-[1px] h-[160%] bg-gradient-to-b from-transparent via-[rgba(229,229,229,0.2)_10%,rgba(229,229,229,0.2)_90%] to-transparent hidden md:block"></div>
            <div className="w-[calc(100%+2px)] h-full min-h-[500px] md:min-h-[690px] outline outline-1 -inset-px  outline-card-border/20 p-10 pt-8  relative box-border flex flex-col gap-8">
              {/* Coins blancs */}
              <div className="absolute w-0.5 h-0.5 bg-white top-[-1px] left-[-1px] -translate-x-px -translate-y-px"></div>
              <div className="absolute w-0.5 h-0.5 bg-white top-[-1px] right-[-1px] translate-x-px -translate-y-px"></div>
              <div className="absolute w-0.5 h-0.5 bg-white bottom-[-1px] right-[-1px] translate-x-px translate-y-px"></div>
              <div className="absolute w-0.5 h-0.5 bg-white bottom-[-1px] left-[-1px] -translate-x-px translate-y-px"></div>
              <h4 className="text-w1 title-2">Please fill in the info below to schedule your demo</h4>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    className="!bg-bg1 !border-[0.5px]"
                    style={{ borderColor: 'hsla(240,8%,95%,.25)' }}
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    className="!bg-bg1 !border-[0.5px]"
                    style={{ borderColor: 'hsla(240,8%,95%,.25)' }}
                  />
                </div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="!bg-bg1 !border-[0.5px]"
                  style={{ borderColor: 'hsla(240,8%,95%,.25)' }}
                />
                <Input
                  label="Company Name"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  className="!bg-bg1 !border-[0.5px]"
                  style={{ borderColor: 'hsla(240,8%,95%,.25)' }}
                />
                <Input
                  label="Job Title"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                  className="!bg-bg1 !border-[0.5px]"
                  style={{ borderColor: 'hsla(240,8%,95%,.25)' }}
                />
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-light/90 mb-1.5">
                    Additional Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={3}
                    maxLength={255}
                    className="rounded-md shadow-sm px-3 py-2 text-sm !border-[0.5px] focus:border-primary focus:ring-2 focus:ring-primary/20 !bg-bg1 text-light placeholder-light/30 w-full"
                    style={{ borderColor: 'hsla(240,8%,95%,.25)' }}
                    value={form.comments}
                    onChange={handleChange}
                    placeholder="Let us know anything else..."
                  />
                </div>
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {success && (
                  <div className="text-green-400 text-sm">
                    Thank you! Your request has been received.
                  </div>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                  className="mt-4"
                >
                  {loading ? "Submitting..." : "Book a demo"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 