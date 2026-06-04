
'use client'
import { SimplePage } from "../components/SimplePage";


export const PageSet = () => (
  <SimplePage title="Contact Us">
    <div className="grid gap-3 md:grid-cols-2">
      <input placeholder="Your Name" className="rounded border border-gray-300 px-3 py-2" />
      <input placeholder="Email" className="rounded border border-gray-300 px-3 py-2" />
      <textarea placeholder="Message" className="rounded border border-gray-300 px-3 py-2 md:col-span-2" rows={5} />
    </div>
  </SimplePage>
);