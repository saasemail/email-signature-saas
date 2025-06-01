'use client'
import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

export default function Home() {
  const previewRef = useRef(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

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

  useEffect(() => {
    if (form.website) {
      QRCode.toDataURL(form.website)
        .then(url => setQrCodeUrl(url))
        .catch(() => setQrCodeUrl(''))
    } else {
      setQrCodeUrl('')
    }
  }, [form.website])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: file, imageBase64: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null, imageBase64: '' }))
  }

  const SignaturePreview = () => {
    const { fullName, jobTitle, company, phone, website, color, bgColor, imageBase64, template } = form
    const commonStyles = { backgroundColor: bgColor, color: color, padding: '16px', borderRadius: '8px' }

    if (template === 'modern') {
      return (
        <div style={{ ...commonStyles, fontFamily: 'sans-serif', borderLeft: `4px solid ${color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {imageBase64 && <img src={imageBase64} width="60" style={{ borderRadius: '8px' }} alt="avatar" />}
            <div>
              {fullName && <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{fullName}</div>}
              {(jobTitle || company) && <div>{jobTitle}{jobTitle && company ? ' @ ' : ''}{company}</div>}
              {phone && <div>📞 {phone}</div>}
              {website && <div>🌐 <a href={website} target="_blank" rel="noopener noreferrer" style={{ color }}>{website}</a></div>}
            </div>
          </div>
        </div>
      )
    }

    if (template === 'bold') {
      return (
        <div style={{ ...commonStyles, fontFamily: 'Arial Black', padding: '20px', textTransform: 'uppercase' }}>
          {imageBase64 && <img src={imageBase64} width="100" style={{ marginBottom: '10px' }} alt="avatar" />}
          {fullName && <div style={{ fontSize: '20px' }}>{fullName}</div>}
          {(jobTitle || company) && <div style={{ margin: '4px 0' }}>{jobTitle}{jobTitle && company ? ' - ' : ''}{company}</div>}
          {(phone || website) && (
            <div>
              {phone}
              {phone && website ? ' • ' : ''}
              {website && <a href={website} target="_blank" rel="noopener noreferrer" style={{ color }}>{website}</a>}
            </div>
          )}
        </div>
      )
    }

    return (
      <table style={{ ...commonStyles, fontFamily: 'Arial', fontSize: '14px', padding: '10px' }}>
        <tbody>
          <tr>
            {imageBase64 && <td style={{ paddingRight: '10px' }}><img src={imageBase64} width="80" style={{ borderRadius: '6px' }} alt="avatar" /></td>}
            <td>
              {fullName && <strong>{fullName}</strong>}<br />
              {(jobTitle || company) && <>{jobTitle}{jobTitle && company ? ' at ' : ''}{company}<br /></>}
              {phone && <>📞 {phone}<br /></>}
              {website && <>🌐 <a href={website} target="_blank" rel="noopener noreferrer" style={{ color }}>{website}</a><br /></>}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  const getTemplateHTML = () => {
    const container = document.createElement('div')
    container.innerHTML = document.getElementById('preview-box')?.innerHTML || ''
    return container.innerHTML
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getTemplateHTML())
    alert('Signature HTML copied!')
  }

  const downloadHTML = () => {
    const blob = new Blob([getTemplateHTML()], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'signature.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPNG = () => {
    if (!previewRef.current) return
    html2canvas(previewRef.current).then((canvas) => {
      const link = document.createElement('a')
      link.href = canvas.toDataURL()
      link.download = 'signature.png'
      link.click()
    })
  }

  const downloadPDF = () => {
    if (!previewRef.current) return
    html2canvas(previewRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('signature.pdf')
    })
  }

  const resetForm = () => {
    setForm({
      fullName: '', jobTitle: '', company: '', phone: '', website: '',
      color: '#000000', bgColor: '#ffffff', image: null, imageBase64: '', template: 'classic'
    })
  }

  return (
    <main className="min-h-screen bg-white text-black px-4 py-6 sm:px-6 lg:px-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Email Signature Generator</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
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
              <div className="relative inline-block mt-2">
                <img src={form.imageBase64} alt="preview" className="h-20 rounded border" />
                <button onClick={removeImage} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full hover:bg-red-600">✕</button>
              </div>
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

          <button onClick={resetForm} className="w-full mt-4 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">Reset</button>

          {qrCodeUrl && (
            <div className="mt-4">
              <label className="block text-sm mb-1">QR Code for Website</label>
              <img src={qrCodeUrl} alt="QR Code" className="h-28 w-28 border p-1 bg-white" />
            </div>
          )}
        </div>

        <div className="flex-1 bg-white border rounded p-4 flex flex-col justify-between" style={{ height: '420px' }}>
          <div id="preview-box" ref={previewRef} className="flex-1 overflow-auto">
            <SignaturePreview />
          </div>
          <div className="flex justify-between items-center flex-wrap gap-2 mt-4 pt-4 border-t">
            <button onClick={copyToClipboard} className="px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition">Copy HTML</button>
            <button onClick={downloadHTML} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Download HTML</button>
            <button onClick={downloadPNG} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Download PNG</button>
            <button onClick={downloadPDF} className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Download PDF</button>
            <span className="text-xs text-gray-500 ml-auto">Generated by <a href="https://email-signature-saas.vercel.app" className="underline" target="_blank">EmailSignatureSaaS</a></span>
          </div>
        </div>
      </div>
    </main>
  )
}
