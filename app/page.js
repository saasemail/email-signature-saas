'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    company: '',
    phone: '',
    website: '',
    color: '#000000',
    bgColor: '#ffffff',
    image: null,
    imageBase64: '',
    template: 'classic'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm({ ...form, image: file, imageBase64: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const getTemplateHTML = () => {
    const { fullName, jobTitle, company, phone, website, color, bgColor, imageBase64, template } = form

    const safe = (label, value, icon = '') => value ? `<div>${icon} ${label}${value}</div>` : ''

    if (template === 'modern') {
      return `
        <div style="font-family:sans-serif; background:${bgColor}; color:${color}; padding:16px; border-left:4px solid ${color};">
          <div style="display:flex; align-items:center; gap:12px;">
            ${imageBase64 ? `<img src="${imageBase64}" width="60" style="border-radius:8px;" />` : ''}
            <div>
              ${fullName ? `<div style="font-size:18px; font-weight:bold;">${fullName}</div>` : ''}
              ${jobTitle || company ? `<div>${jobTitle}${jobTitle && company ? ' @ ' : ''}${company}</div>` : ''}
              ${phone ? `<div>📞 ${phone}</div>` : ''}
              ${website ? `<div>🌐 <a href="${website}" style="color:${color};">${website}</a></div>` : ''}
            </div>
          </div>
        </div>
      `
    }

    if (template === 'bold') {
      return `
        <div style="font-family:Arial Black; background:${bgColor}; color:${color}; padding:20px; text-transform:uppercase;">
          ${imageBase64 ? `<img src="${imageBase64}" width="100" style="margin-bottom:10px;" />` : ''}
          ${fullName ? `<div style="font-size:20px;">${fullName}</div>` : ''}
          ${jobTitle || company ? `<div style="margin:4px 0;">${jobTitle}${jobTitle && company ? ' - ' : ''}${company}</div>` : ''}
          ${(phone || website) ? `<div>${phone ? phone : ''}${phone && website ? ' • ' : ''}${website ? `<a href="${website}" style="color:${color};">${website}</a>` : ''}</div>` : ''}
        </div>
      `
    }

    // default: classic
    return `
      <table style="font-family:Arial; font-size:14px; background:${bgColor}; color:${color}; padding:10px;">
        <tr>
          ${imageBase64 ? `<td style="padding-right:10px;"><img src="${imageBase64}" alt="avatar" width="80" style="border-radius:6px;" /></td>` : ''}
          <td>
            ${fullName ? `<strong>${fullName}</strong><br/>` : ''}
            ${jobTitle || company ? `${jobTitle}${jobTitle && company ? ' at ' : ''}${company}<br/>` : ''}
            ${phone ? `📞 ${phone}<br/>` : ''}
            ${website ? `🌐 <a href="${website}" style="color:${color};">${website}</a>` : ''}
          </td>
        </tr>
      </table>
    `
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getTemplateHTML())
    alert('Signature HTML copied!')
  }

  return (
    <main className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Email Signature Generator</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="website" placeholder="Website (https://...)" value={form.website} onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="flex gap-4">
            <div>
              <label className="block text-sm">Text Color</label>
              <input type="color" name="color" value={form.color} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm">Background</label>
              <input type="color" name="bgColor" value={form.bgColor} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Upload Avatar / Logo</label>
            <label className="inline-block px-4 py-2 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition">
              Choose File
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {form.imageBase64 && (
              <img src={form.imageBase64} alt="preview" className="mt-2 h-20 rounded border" />
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 mt-2">Choose Template</label>
            <select name="template" value={form.template} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <div dangerouslySetInnerHTML={{ __html: getTemplateHTML() }} />
          <button onClick={copyToClipboard} className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            Copy HTML
          </button>
        </div>
      </div>
    </main>
  )
}
