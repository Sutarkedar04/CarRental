import { useState, useEffect } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone, FaCheck, FaTimes, FaSpinner, FaUserClock } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const DealerApprovals = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null); // tracks which card is mid-request

  const fetchPendingDealers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/dealers/pending`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to load dealer applications');
        setDealers([]);
        return;
      }

      setDealers(data.data);
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDealers();
  }, []);

  const handleDecision = async (dealerId, decision) => {
    setActioningId(dealerId);
    try {
      const res = await fetch(`${API_BASE}/auth/dealers/${dealerId}/verify`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ decision })
      });
      const data = await res.json();

      if (data.success) {
        // Remove from the pending list immediately — no need to refetch everything
        setDealers(prev => prev.filter(d => d._id !== dealerId));
      } else {
        setError(data.message || `Failed to ${decision === 'verified' ? 'approve' : 'reject'} dealer`);
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaUserClock className="text-blue-400" />
              Dealer Applications
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Review and approve dealers before their cars go live
            </p>
          </div>
          <button
            onClick={fetchPendingDealers}
            disabled={loading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FaSpinner className="animate-spin text-3xl mb-3" />
            <p>Loading dealer applications…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && dealers.length === 0 && !error && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center">
            <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
            <p className="text-gray-300 font-medium">No pending applications</p>
            <p className="text-gray-500 text-sm mt-1">You're all caught up.</p>
          </div>
        )}

        {/* Dealer cards */}
        <div className="space-y-4">
          {dealers.map((dealer) => (
            <div
              key={dealer._id}
              className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <FaBuilding className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {dealer.dealerProfile?.businessName || dealer.name}
                    </h3>
                    <p className="text-gray-500 text-xs">Applicant: {dealer.name}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    {dealer.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-500" />
                    {dealer.phone || '—'}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    {dealer.dealerProfile?.city || '—'}
                  </div>
                </div>

                <p className="text-gray-600 text-xs mt-3">
                  Applied {new Date(dealer.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDecision(dealer._id, 'rejected')}
                  disabled={actioningId === dealer._id}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <FaTimes /> Reject
                </button>
                <button
                  onClick={() => handleDecision(dealer._id, 'verified')}
                  disabled={actioningId === dealer._id}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {actioningId === dealer._id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealerApprovals;