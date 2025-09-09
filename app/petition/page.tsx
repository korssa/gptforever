export default function PetitionPage() {
  return (
    <main className="w-full min-h-screen bg-white p-4">
      <h1 className="text-xl font-bold mb-6">✍️ Online Petition to Support Continued Use of chatGPT 4o (Legacy)</h1>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSfmFPpGWs2bS4BS8zDWQdLFH-SfopbeUVC1MLuP-uMZgRjvUw/viewform?embedded=true" 
        width="100%" 
        height="2200" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0} 
        style={{ border: "none" }}
      >
        Loading…
      </iframe>
    </main>
  )
}