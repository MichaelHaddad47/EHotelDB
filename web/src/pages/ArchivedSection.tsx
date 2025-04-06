// src/pages/ArchivedSection.tsx

export default function ArchivedSection() {
    return (
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">🚧 Archived Feature Under Construction</h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-6">
          This section will allow admins to view and manage rooms that have been deleted,
          maintaining a record for auditing or potential recovery.
        </p>
  
        <div className="bg-slate-800 border border-yellow-500 p-6 rounded-lg inline-block text-left max-w-xl mx-auto">
          <h3 className="text-xl font-semibold text-yellow-300 mb-2">💡 How It Will Work</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-200 text-sm">
            <li>When a room is <strong>deleted</strong> by an admin, it will be added to this archived list.</li>
            <li>Admins can use this section to review details like price, damages, and amenities.</li>
            <li>This section helps ensure <code>transparency</code> and can assist in future room restoration.</li>
            <li>Archived rooms will be <strong>read-only</strong> and not available for booking.</li>
          </ul>
        </div>
      </div>
    );
  }
  