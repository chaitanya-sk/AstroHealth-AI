import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  CheckCheck, 
  Clock, 
  Search,
  Volume2,
  VolumeX
} from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { initialAlerts } from '../data/mockData';

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, ACTIVE, ACKNOWLEDGED
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAlertModal, setSelectedAlertModal] = useState(null);

  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterPriority !== 'ALL' && a.priority !== filterPriority) return false;
    if (filterStatus === 'ACTIVE' && a.acknowledged) return false;
    if (filterStatus === 'ACKNOWLEDGED' && !a.acknowledged) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    }
    return true;
  });

  const criticalCount = alerts.filter(a => a.priority === 'RED' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.priority === 'YELLOW' && !a.acknowledged).length;
  const normalCount = alerts.filter(a => a.priority === 'GREEN').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>

      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-status badge-red">
              MISSION THREAT MATRIX
            </span>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              AUTONOMOUS TRIAGE ENGINE
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
            color: '#FFFFFF'
          }}>
            MISSION HEALTH ALERTS
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Audio Telemetry Chirp Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary"
            title="Toggle Alert Audio Chirps"
            style={{ padding: '8px 12px' }}
          >
            {soundEnabled ? <Volume2 size={16} color="var(--orange-accent)" /> : <VolumeX size={16} />}
            <span style={{ fontSize: '0.8rem' }}>{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {/* Acknowledge All */}
          <button
            onClick={handleAcknowledgeAll}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '9px 16px' }}
          >
            <CheckCheck size={16} /> ACKNOWLEDGE ALL
          </button>
        </div>
      </div>

      {/* Priority Counters Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px'
      }}>
        {/* Critical Alerts Counter */}
        <div
          onClick={() => setFilterPriority(filterPriority === 'RED' ? 'ALL' : 'RED')}
          className={`glass-panel ${filterPriority === 'RED' ? 'glass-panel-glow' : ''}`}
          style={{
            padding: '16px',
            borderLeft: '4px solid var(--red-emergency)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: 'var(--font-tech)' }}>
              CRITICAL ALERTS
            </span>
            <ShieldAlert size={16} color="var(--red-emergency)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--red-emergency)', marginTop: '4px' }}>
            {criticalCount} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ACTIVE</span>
          </div>
        </div>

        {/* Attention Required Counter */}
        <div
          onClick={() => setFilterPriority(filterPriority === 'YELLOW' ? 'ALL' : 'YELLOW')}
          className={`glass-panel ${filterPriority === 'YELLOW' ? 'glass-panel-glow' : ''}`}
          style={{
            padding: '16px',
            borderLeft: '4px solid var(--yellow-warning)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: 'var(--font-tech)' }}>
              ATTENTION REQUIRED
            </span>
            <AlertTriangle size={16} color="var(--yellow-warning)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--yellow-warning)', marginTop: '4px' }}>
            {warningCount} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ATTENTION</span>
          </div>
        </div>

        {/* Normal / Routine Counter */}
        <div
          onClick={() => setFilterPriority(filterPriority === 'GREEN' ? 'ALL' : 'GREEN')}
          className={`glass-panel ${filterPriority === 'GREEN' ? 'glass-panel-glow' : ''}`}
          style={{
            padding: '16px',
            borderLeft: '4px solid var(--green-safe)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: 'var(--font-tech)' }}>
              ROUTINE / NORMAL
            </span>
            <CheckCircle2 size={16} color="var(--green-safe)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--green-safe)', marginTop: '4px' }}>
            {normalCount} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>LOGGED</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(17, 17, 19, 0.7)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '12px 16px'
      }} className="glass-panel">
        {/* Priority Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'RED', label: 'Red (Critical)' },
            { id: 'YELLOW', label: 'Yellow (Warning)' },
            { id: 'GREEN', label: 'Green (Normal)' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterPriority(btn.id)}
              style={{
                background: filterPriority === btn.id ? 'var(--orange-accent)' : 'rgba(24, 24, 27, 0.8)',
                color: filterPriority === btn.id ? '#FFF' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: filterPriority === btn.id ? 'var(--orange-accent)' : 'var(--border-color)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-tech)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search telemetry..."
            style={{
              width: '100%',
              background: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 12px 6px 32px',
              color: '#FFF',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-tech)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Alerts Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={32} color="var(--green-safe)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF' }}>
              No Active Alerts Found
            </div>
            <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>
              All biosensors and habitat parameters are within operational baselines.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onViewDetails={(a) => setSelectedAlertModal(a)}
            />
          ))
        )}
      </div>

    </div>
  );
}
