'use client'

export const SimplePage = ({ title, children }) => (
  <div className="bg-[#f3f3f3] py-8">
    <div className="container mx-auto w-full px-4">
      <h1 className="text-4xl text-[44px] font-semibold">{title}</h1>
      <div className="mt-4 rounded border border-gray-300 bg-white p-4">{children}</div>
    </div>
  </div>
);