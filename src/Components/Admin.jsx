 import React, { useState, useEffect, useCallback } from 'react';
import './Admin.css';

// ============================
// API Base URL
// ============================
const API = 'https://server-r5ni.onrender.com/api';

// ============================
// Form Record Management Component
// ============================
const FormRecordManagement = () => {
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem("formRecordManagement_v1");
      const INITIAL_DATA = [
        { sn: 1,  supervisor: "रन्जिता वि.क",    municipality: "गौरिशकर गा.पा",   enumerator: "हरि बहादुर खत्री",    code: "E01", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 2,  supervisor: "रन्जिता वि.क",    municipality: "गौरिशकर गा.पा",   enumerator: "रीता खड्का",          code: "E02", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 3,  supervisor: "रन्जिता वि.क",    municipality: "गौरिशकर गा.पा",   enumerator: "गोविन्द वि.क",        code: "E03", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 4,  supervisor: "रन्जिता वि.क",    municipality: "बि.गु. गा.पा",     enumerator: "ओङ्दी शेर्पा",        code: "E04", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 5,  supervisor: "रन्जिता वि.क",    municipality: "बि.गु. गा.पा",     enumerator: "पार्बती थापा",        code: "E05", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, remainingWithSupervisor: 0 },
        { sn: 6,  supervisor: "रन्जिता वि.क",    municipality: "बि.गु. गा.पा",     enumerator: "उषा अर्याल",          code: "E06", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 7,  supervisor: "रुथ श्रेष्ठ",     municipality: "कालिन्चोक गा.पा",  enumerator: "गौरव शिवाकोटी",       code: "E07", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 8,  supervisor: "रुथ श्रेष्ठ",     municipality: "कालिन्चोक गा.पा",  enumerator: "नमिका आचार्य",        code: "E08", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 9,  supervisor: "रुथ श्रेष्ठ",     municipality: "कालिन्चोक गा.पा",  enumerator: "अम्बिका कठेत",        code: "E09", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 10, supervisor: "रुथ श्रेष्ठ",     municipality: "कालिन्चोक गा.पा",  enumerator: "अजिता ओली",           code: "E10", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 11, supervisor: "सुमित्रा जिरेल",  municipality: "बैतेश्वर गा.पा",   enumerator: "निराजन घतानी",        code: "E11", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 12, supervisor: "सुमित्रा जिरेल",  municipality: "बैतेश्वर गा.पा",   enumerator: "प्रमिला तमाङ",        code: "E12", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 13, supervisor: "सुमित्रा जिरेल",  municipality: "बैतेश्वर गा.पा",   enumerator: "जानुका मिजार",        code: "E13", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 14, supervisor: "सुमित्रा जिरेल",  municipality: "जिरी न.पा.",        enumerator: "अनिशा जिरेल",         code: "E14", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 15, supervisor: "सुमित्रा जिरेल",  municipality: "जिरी न.पा.",        enumerator: "सन्जित जिरेल",        code: "E15", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 16, supervisor: "सुमित्रा जिरेल",  municipality: "जिरी न.पा.",        enumerator: "दर्शन थापा",          code: "E16", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 17, supervisor: "विक्रम शिवाकोटी", municipality: "तामाकोशी गा.पा",   enumerator: "राजेश सार्की",        code: "E17", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 18, supervisor: "विक्रम शिवाकोटी", municipality: "तामाकोशी गा.पा",   enumerator: "मनिता फुयाल",         code: "E18", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 19, supervisor: "विक्रम शिवाकोटी", municipality: "तामाकोशी गा.पा",   enumerator: "अनिशा बस्नेत",        code: "E19", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 20, supervisor: "विक्रम शिवाकोटी", municipality: "शैलुङ गा.पा",      enumerator: "निरोज सापकोटा",       code: "E20", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 21, supervisor: "विक्रम शिवाकोटी", municipality: "शैलुङ गा.पा",      enumerator: "निरु भण्डारी",        code: "E21", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 22, supervisor: "विक्रम शिवाकोटी", municipality: "शैलुङ गा.पा",      enumerator: "सबिता थपलिया",        code: "E22", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 23, supervisor: "विक्रम शिवाकोटी", municipality: "मेलुङ गा.पा",      enumerator: "शृजना मिजार",         code: "E23", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 24, supervisor: "विक्रम शिवाकोटी", municipality: "मेलुङ गा.पा",      enumerator: "अपेक्षा थापा",        code: "E24", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 25, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "दिपा कार्की",         code: "E25", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 26, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "शान्त प्रसाद सुवेदि", code: "E26", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 27, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "धन कुमारी थामि",      code: "E27", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 28, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "प्रेङका ओली",         code: "E28", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 29, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "साजन ठकुरी",          code: "E29", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 30, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "रन्जना के.सी",        code: "E30", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 31, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "अमृत कुमार मुग्राती", code: "E31", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 32, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "सचिन बस्नेत",         code: "E32", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
        { sn: 33, supervisor: "रेणुका थामी",      municipality: "भिमेश्वर न.पा",   enumerator: "अरुणा लगुन",          code: "E33", totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
      ];
      return stored ? JSON.parse(stored) : INITIAL_DATA;
    } catch { return []; }
  });

  const [view, setView] = useState("folders");
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [search, setSearch] = useState("");
  const [editForm, setEditForm] = useState({
    sn: "", supervisor: "", municipality: "", enumerator: "", code: "",
    totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0,
    checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0
  });
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const MUNICIPALITIES = [...new Set(records.map(d => d.municipality))];
  const SUPERVISORS = [...new Set(records.map(d => d.supervisor))];

  useEffect(() => {
    localStorage.setItem("formRecordManagement_v1", JSON.stringify(records));
    localStorage.setItem("formRecordManagement_updated", Date.now().toString());
  }, [records]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const saveRecord = () => {
    const rec = {
      ...editForm,
      sn: editForm.sn || records.length + 1,
      totalFilled: +editForm.totalFilled || 0,
      transferredToSupervisor: +editForm.transferredToSupervisor || 0,
      remainingWithEnumerator: +editForm.remainingWithEnumerator || 0,
      checkedBySupervisor: +editForm.checkedBySupervisor || 0,
      transferredToDistrict: +editForm.transferredToDistrict || 0,
      remainingWithSupervisor: +editForm.remainingWithSupervisor || 0,
    };
    let updated;
    if (editModal.isNew) {
      updated = [...records, rec];
      showToast(`✅ ${rec.enumerator} added successfully`);
    } else {
      updated = records.map(r => r.code === rec.code ? rec : r);
      showToast(`✅ ${rec.enumerator}'s record updated`);
    }
    setRecords(updated);
    setEditModal(null);
  };

  const deleteRecord = (code) => {
    setRecords(records.filter(r => r.code !== code));
    setConfirmDelete(null);
    showToast("🗑️ Record permanently deleted", "warn");
  };

  const folderGroups = MUNICIPALITIES.map(mun => {
    const items = records.filter(r => r.municipality === mun);
    const totalFilled = items.reduce((s, r) => s + r.totalFilled, 0);
    const totalTransferred = items.reduce((s, r) => s + r.transferredToDistrict, 0);
    return { mun, items, totalFilled, totalTransferred, count: items.length };
  });

  const filteredInFolder = selectedMunicipality
    ? records.filter(r =>
        r.municipality === selectedMunicipality &&
        (search === "" || r.enumerator.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const allFiltered = search
    ? records.filter(r =>
        r.enumerator.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.municipality.toLowerCase().includes(search.toLowerCase()) ||
        r.supervisor.toLowerCase().includes(search.toLowerCase())
      )
    : records;

  const grandTotals = {
    totalFilled: records.reduce((s, r) => s + r.totalFilled, 0),
    transferred: records.reduce((s, r) => s + r.transferredToSupervisor, 0),
    checked: records.reduce((s, r) => s + r.checkedBySupervisor, 0),
    toDistrict: records.reduce((s, r) => s + r.transferredToDistrict, 0),
  };

  const pct = (val, total) => total > 0 ? Math.min(100, Math.round((val / total) * 100)) : 0;
  const openEdit = (record) => { setEditForm({ ...record }); setEditModal({ record, isNew: false }); };
  const openAdd = () => {
    const nextSn = records.length + 1;
    const nextCode = `E${String(nextSn).padStart(2, "0")}`;
    setEditForm({ sn: nextSn, supervisor: "", municipality: "", enumerator: "", code: nextCode, totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 });
    setEditModal({ record: null, isNew: true });
  };
  const ef = (field, val) => setEditForm(f => ({ ...f, [field]: val }));

  return (
    <div className="frm-root">
      <div className="frm-header">
        <div className="frm-title">
          <div className="frm-logo">📁</div>
          <div>
            <h1>Form Record Management</h1>
            <p>National Economic Census 2082 · District Office, Dolakha</p>
          </div>
        </div>
        <div className="frm-nav">
          <button className={view === "folders" ? "active" : ""} onClick={() => { setView("folders"); setSelectedMunicipality(null); }}>📂 Folders</button>
          <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>📋 All Records</button>
          <button className={view === "stats" ? "active" : ""} onClick={() => setView("stats")}>📊 By Municipality</button>
        </div>
      </div>

      <div className="frm-summary">
        <div className="sum-card"><div className="sum-label">Total Enumerators</div><div className="sum-val blue">{records.length}</div></div>
        <div className="sum-card"><div className="sum-label">Forms Filled</div><div className="sum-val green">{grandTotals.totalFilled.toLocaleString()}</div></div>
        <div className="sum-card"><div className="sum-label">To Supervisor</div><div className="sum-val amber">{grandTotals.transferred.toLocaleString()}</div></div>
        <div className="sum-card"><div className="sum-label">Checked</div><div className="sum-val blue">{grandTotals.checked.toLocaleString()}</div></div>
        <div className="sum-card"><div className="sum-label">To District</div><div className="sum-val green">{grandTotals.toDistrict.toLocaleString()}</div></div>
        <div className="sum-card"><div className="sum-label">Municipalities</div><div className="sum-val amber">{MUNICIPALITIES.length}</div></div>
      </div>

      <div className="frm-bar">
        <input className="frm-search" placeholder="🔍  Search enumerator, code, municipality..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn-add" onClick={openAdd}>＋ Add Record</button>
      </div>

      {view === "folders" && !selectedMunicipality && (
        <div className="folder-grid">
          {folderGroups.filter(g => g.count > 0).map(g => (
            <div key={g.mun} className="folder-card" onClick={() => { setSelectedMunicipality(g.mun); setSearch(""); }}>
              <div className="folder-count">{g.count}</div>
              <div className="folder-icon">📂</div>
              <div className="folder-name">{g.mun}</div>
              <div className="folder-meta">Forms filled: {g.totalFilled} · To district: {g.totalTransferred}</div>
              <div className="folder-progress"><div className="folder-progress-fill" style={{ width: `${pct(g.totalTransferred, g.totalFilled)}%` }} /></div>
            </div>
          ))}
        </div>
      )}

      {view === "folders" && selectedMunicipality && (
        <>
          <div className="frm-bread">
            <span className="bread-link" onClick={() => setSelectedMunicipality(null)}>📂 All Folders</span>
            <span>›</span>
            <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{selectedMunicipality}</span>
          </div>
          <div className="frm-table-wrap">
            <table className="frm-table">
              <thead><tr><th>S.N</th><th>Code</th><th>Enumerator</th><th>Supervisor</th><th>Total Filled</th><th>→ Supervisor</th><th>Remaining</th><th>Checked</th><th>→ District</th><th>Sup. Remaining</th><th>Progress</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredInFolder.length === 0 ? <tr><td colSpan="12"><div className="empty-msg">No records found</div></td></tr> : filteredInFolder.map(r => (
                  <tr key={r.code}>
                    <td>{r.sn}</td><td><span className="code-badge">{r.code}</span></td><td className="nep-text">{r.enumerator}</td><td className="nep-text">{r.supervisor}</td>
                    <td className="num-cell">{r.totalFilled}</td><td className="num-cell">{r.transferredToSupervisor}</td><td className="num-cell">{r.remainingWithEnumerator}</td>
                    <td className="num-cell">{r.checkedBySupervisor}</td><td className="num-cell">{r.transferredToDistrict}</td><td className="num-cell">{r.remainingWithSupervisor}</td>
                    <td><div className="prog-wrap"><div className="prog-bar"><div className="prog-fill" style={{ width: `${pct(r.transferredToDistrict, r.totalFilled)}%` }} /></div><span className="prog-pct">{pct(r.transferredToDistrict, r.totalFilled)}%</span></div></td>
                    <td><div className="action-row"><button className="btn-edit" onClick={() => openEdit(r)}>✏️ Edit</button><button className="btn-del" onClick={() => setConfirmDelete(r.code)}>🗑️</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === "table" && (
        <div className="frm-table-wrap">
          <table className="frm-table">
            <thead><tr><th>S.N</th><th>Code</th><th>Enumerator</th><th>Supervisor</th><th>Municipality</th><th>Filled</th><th>→ Sup</th><th>Remaining</th><th>Checked</th><th>→ District</th><th>Sup. Rem.</th><th>Progress</th><th>Actions</th></tr></thead>
            <tbody>
              {allFiltered.length === 0 ? <tr><td colSpan="13"><div className="empty-msg">No records match</div></td></tr> : allFiltered.map(r => (
                <tr key={r.code}>
                  <td>{r.sn}</td><td><span className="code-badge">{r.code}</span></td><td className="nep-text">{r.enumerator}</td><td className="nep-text">{r.supervisor}</td><td className="nep-text">{r.municipality}</td>
                  <td className="num-cell">{r.totalFilled}</td><td className="num-cell">{r.transferredToSupervisor}</td><td className="num-cell">{r.remainingWithEnumerator}</td>
                  <td className="num-cell">{r.checkedBySupervisor}</td><td className="num-cell">{r.transferredToDistrict}</td><td className="num-cell">{r.remainingWithSupervisor}</td>
                  <td><div className="prog-wrap"><div className="prog-bar"><div className="prog-fill" style={{ width: `${pct(r.transferredToDistrict, r.totalFilled)}%` }} /></div><span className="prog-pct">{pct(r.transferredToDistrict, r.totalFilled)}%</span></div></td>
                  <td><div className="action-row"><button className="btn-edit" onClick={() => openEdit(r)}>✏️ Edit</button><button className="btn-del" onClick={() => setConfirmDelete(r.code)}>🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "stats" && (
        <div className="stats-grid">
          {folderGroups.map(g => (
            <div key={g.mun} className="stats-card">
              <h3>📂 {g.mun}</h3>
              {g.items.map(r => (
                <div key={r.code} className="stats-row">
                  <span className="stats-name">{r.enumerator} <span className="code-badge" style={{fontSize:'0.65rem'}}>{r.code}</span></span>
                  <span className="stats-num">{r.totalFilled}</span>
                </div>
              ))}
              <hr className="modal-divider" />
              <div className="stats-row">
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>TOTAL FILLED</span>
                <span className="stats-num" style={{ color: 'var(--green)' }}>{g.totalFilled}</span>
              </div>
              <div className="stats-row">
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>TO DISTRICT</span>
                <span className="stats-num">{g.totalTransferred}</span>
              </div>
              <div className="folder-progress" style={{ marginTop: 8 }}>
                <div className="folder-progress-fill" style={{ width: `${pct(g.totalTransferred, g.totalFilled)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>{editModal.isNew ? "➕ Add New Enumerator Record" : `✏️ Edit: ${editForm.enumerator}`}</h2>
            <div className="form-grid">
              <div className="form-group"><label>S.N</label><input type="number" value={editForm.sn} onChange={e => ef("sn", e.target.value)} /></div>
              <div className="form-group"><label>Code (ग.स.न.)</label><input value={editForm.code} onChange={e => ef("code", e.target.value)} placeholder="E01" /></div>
              <div className="form-group full"><label>Enumerator Name (गणक)</label><input value={editForm.enumerator} onChange={e => ef("enumerator", e.target.value)} placeholder="गणकको नाम" /></div>
              <div className="form-group"><label>Supervisor</label>
                <select value={editForm.supervisor} onChange={e => ef("supervisor", e.target.value)}>
                  <option value="">— Select Supervisor —</option>
                  {SUPERVISORS.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="__custom__">Other...</option>
                </select>
              </div>
              {editForm.supervisor === "__custom__" && <div className="form-group"><label>Supervisor Name</label><input value="" onChange={e => ef("supervisor", e.target.value)} placeholder="नाम लेख्नुस्" /></div>}
              <div className="form-group"><label>Municipality (स्थानिय तह)</label>
                <select value={editForm.municipality} onChange={e => ef("municipality", e.target.value)}>
                  <option value="">— Select —</option>
                  {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <hr className="modal-divider" style={{ gridColumn: '1/-1' }} />
              <div className="form-group"><label>Total Forms Filled</label><input type="number" min="0" value={editForm.totalFilled} onChange={e => ef("totalFilled", e.target.value)} /></div>
              <div className="form-group"><label>Transferred to Supervisor</label><input type="number" min="0" value={editForm.transferredToSupervisor} onChange={e => ef("transferredToSupervisor", e.target.value)} /></div>
              <div className="form-group"><label>Remaining with Enumerator</label><input type="number" min="0" value={editForm.remainingWithEnumerator} onChange={e => ef("remainingWithEnumerator", e.target.value)} /></div>
              <div className="form-group"><label>Checked by Supervisor</label><input type="number" min="0" value={editForm.checkedBySupervisor} onChange={e => ef("checkedBySupervisor", e.target.value)} /></div>
              <div className="form-group"><label>Transferred to District</label><input type="number" min="0" value={editForm.transferredToDistrict} onChange={e => ef("transferredToDistrict", e.target.value)} /></div>
              <div className="form-group"><label>Remaining with Supervisor</label><input type="number" min="0" value={editForm.remainingWithSupervisor} onChange={e => ef("remainingWithSupervisor", e.target.value)} /></div>
            </div>
            <div className="modal-actions"><button className="btn-cancel" onClick={() => setEditModal(null)}>Cancel</button><button className="btn-save" onClick={saveRecord}>{editModal.isNew ? "Add Record" : "Save Changes"}</button></div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-box danger-confirm" onClick={e => e.stopPropagation()}>
            <div className="danger-icon">⚠️</div>
            <h3>Permanently Delete Record?</h3>
            <p>This will <strong>permanently</strong> remove <strong>{records.find(r => r.code === confirmDelete)?.enumerator}</strong> ({confirmDelete}) from the system. This action <strong>cannot be undone</strong>.</p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-save btn-danger-confirm" onClick={() => deleteRecord(confirmDelete)}>🗑️ Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

// ============================
// Main Admin Component
// ============================
const Admin = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [allWorkData, setAllWorkData] = useState({});
  const [allAttendanceData, setAllAttendanceData] = useState({});
  const [allDocuments, setAllDocuments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedStaffForReset, setSelectedStaffForReset] = useState(null);
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [todayAttendance, setTodayAttendance] = useState({ present: [], absent: [], late: [], halfDay: [] });
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [newStaffId, setNewStaffId] = useState('');
  const [newStaffPasswordCreate, setNewStaffPasswordCreate] = useState('');
  const [notices, setNotices] = useState([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal' });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [dataArchives, setDataArchives] = useState([]);
  const [showAdminChangePwdModal, setShowAdminChangePwdModal] = useState(false);
  const [adminPwdData, setAdminPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [suspendedStaff, setSuspendedStaff] = useState([]);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDurationHours, setSuspendDurationHours] = useState(24);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [showRealTimeModal, setShowRealTimeModal] = useState(false);
  const [selectedRealTimeStaff, setSelectedRealTimeStaff] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [showBulkResetModal, setShowBulkResetModal] = useState(false);
  const [bulkResetPassword, setBulkResetPassword] = useState('');
  const [showPerformanceReportModal, setShowPerformanceReportModal] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [user, setUser] = useState(null);

  // NEW: Permanent Delete Staff State
  const [showDeleteStaffModal, setShowDeleteStaffModal] = useState(false);
  const [deleteStaffTarget, setDeleteStaffTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteStaffOptions, setDeleteStaffOptions] = useState({ deleteWorkData: true, deleteAttendance: true, deleteDocuments: true });

  // NEW: Quick Stats Panel State
  const [showQuickStats, setShowQuickStats] = useState(false);

  // ============================
  // HELPER FUNCTIONS
  // ============================
  const logActivity = (action, details) => {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: user?.id || 'SYSTEM',
      action,
      details,
      role: 'admin'
    };
    logs.unshift(newLog);
    localStorage.setItem('activityLogs', JSON.stringify(logs.slice(0, 500)));
    setActivityLogs(logs.slice(0, 100));
  };

  const sendNotification = (title, message, type, forUser, employeeId = null) => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotif = { id: Date.now() + Math.random(), title, message, type, for: forUser, employeeId, timestamp: new Date().toISOString(), read: false };
    allNotifs.unshift(newNotif);
    localStorage.setItem('notifications', JSON.stringify(allNotifs));
  };

  // ============================
  // ✅ CHANGED: loadAllStaffData — now fetches from MongoDB first, then syncs localStorage
  // ============================
  const loadAllStaffData = async () => {
    // Step 1: Fetch staff list from MongoDB and sync into localStorage passwordSystem
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch(`${API}/staff-list`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const mongoStaff = await res.json(); // [{ username, name, createdAt }]
          const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
          for (const s of mongoStaff) {
            // Add to passwordSystem if not already tracked locally
            if (!passwordSystem[s.username]) {
              passwordSystem[s.username] = {
                resetCount: 0,
                lastReset: null,
                createdAt: s.createdAt
              };
            }
            // Ensure localStorage data buckets exist for each staff
            if (!localStorage.getItem(`workData_${s.username}`))
              localStorage.setItem(`workData_${s.username}`, JSON.stringify([]));
            if (!localStorage.getItem(`attendance_${s.username}`))
              localStorage.setItem(`attendance_${s.username}`, JSON.stringify([]));
            if (!localStorage.getItem(`documents_${s.username}`))
              localStorage.setItem(`documents_${s.username}`, JSON.stringify([]));
          }
          localStorage.setItem('passwordSystem', JSON.stringify(passwordSystem));
        }
      }
    } catch (err) {
      console.warn('MongoDB fetch failed, using localStorage only:', err.message);
    }

    // Step 2: Build staff list from (now-synced) localStorage — original logic unchanged
    const staff = [];
    const workData = {};
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    const suspended = JSON.parse(localStorage.getItem('suspendedStaff') || '[]');
    const empIds = Object.keys(passwordSystem).filter(id => id !== 'ADMIN');
    const today = new Date().toISOString().split('T')[0];

    for (const empId of empIds) {
      const stored = localStorage.getItem(`workData_${empId}`);
      const attendanceStored = localStorage.getItem(`attendance_${empId}`);
      const docsStored = localStorage.getItem(`documents_${empId}`);
      let entries = stored ? JSON.parse(stored) : [];
      workData[empId] = entries;
      let attendanceRecs = attendanceStored ? JSON.parse(attendanceStored) : [];
      let documents = docsStored ? JSON.parse(docsStored) : [];

      const todayRecord = attendanceRecs.find(r => r.date === today);
      let attendanceStatus = 'absent';
      let attendanceDisplay = '';
      if (todayRecord) {
        if (todayRecord.checkOut) { attendanceStatus = 'completed'; attendanceDisplay = '✅ Completed'; }
        else if (todayRecord.checkIn) { attendanceStatus = 'checked-in'; attendanceDisplay = todayRecord.status === 'Present' ? '🟢 Present' : '🟡 Half Day'; }
      } else { attendanceDisplay = '🔴 Absent'; }

      const totalCount = entries.reduce((s, e) => s + (parseInt(e.totalCount) || 0), 0);
      const completedTasks = entries.filter(e => e.status === 'completed').length;
      const pendingTasks = entries.filter(e => e.status === 'pending').length;
      const inProgressTasks = entries.filter(e => e.status === 'in-progress').length;
      const attendanceCount = attendanceRecs.length;
      const presentCount = attendanceRecs.filter(r => r.status === 'Present').length;
      const halfDayCount = attendanceRecs.filter(r => r.status === 'Half Day').length;
      const attendanceRate = attendanceCount > 0 ? ((presentCount / attendanceCount) * 100).toFixed(0) : 0;
      const tokenCount = entries.filter(e => e.censusToken).length;
      const lastEntry = entries.length > 0 ? entries[0] : null;
      const lastAttendance = attendanceRecs.length > 0 ? attendanceRecs[attendanceRecs.length - 1] : null;
      let lastActive = null;
      if (lastAttendance?.timestamp) lastActive = new Date(lastAttendance.timestamp);
      if (lastEntry?.id && (!lastActive || new Date(lastEntry.id) > lastActive)) lastActive = new Date(lastEntry.id);

      const createdAt = passwordSystem[empId]?.createdAt || null;

      staff.push({
        id: empId, name: `Enumerator ${empId}`, email: `${empId.toLowerCase()}@census.gov.np`,
        totalCount, completedTasks, pendingTasks, inProgressTasks, totalEntries: entries.length,
        attendanceCount, presentCount, halfDayCount, attendanceRate, documentCount: documents.length,
        tokenCount, resetCount: passwordSystem[empId]?.resetCount || 0,
        lastReset: passwordSystem[empId]?.lastReset?.split('T')[0] || 'Never',
        recentEntries: entries.slice(0, 5), lastActive, suspended: suspended.includes(empId),
        attendanceStatus, attendanceDisplay, createdAt
      });
    }
    staff.sort((a, b) => a.id.localeCompare(b.id));
    setStaffList(staff);
    setAllWorkData(workData);

    const perfData = staff.map(s => ({
      id: s.id, totalCount: s.totalCount, tokenCount: s.tokenCount,
      attendanceRate: s.attendanceRate,
      completionRate: s.totalEntries > 0 ? ((s.completedTasks / s.totalEntries) * 100).toFixed(0) : 0,
      pendingTasks: s.pendingTasks, inProgressTasks: s.inProgressTasks
    }));
    setPerformanceData(perfData);
  };

  const loadAllAttendanceData = () => {
    const attendance = {};
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    const empIds = Object.keys(passwordSystem).filter(id => id !== 'ADMIN');
    const today = new Date().toISOString().split('T')[0];
    const present = [], absent = [], late = [], halfDay = [];

    for (const empId of empIds) {
      const stored = localStorage.getItem(`attendance_${empId}`);
      attendance[empId] = stored ? JSON.parse(stored) : [];
      const todayRecord = attendance[empId].find(r => r.date === today);
      if (todayRecord) {
        if (todayRecord.checkOut || todayRecord.checkIn) {
          if (todayRecord.status === 'Present') present.push(empId);
          else if (todayRecord.status === 'Half Day') halfDay.push(empId);
        }
      } else { absent.push(empId); }
    }
    setAllAttendanceData(attendance);
    setTodayAttendance({ present, absent, late, halfDay });
  };

  const loadAllDocuments = () => {
    const allDocs = {};
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    const empIds = Object.keys(passwordSystem).filter(id => id !== 'ADMIN');
    for (const empId of empIds) {
      const stored = localStorage.getItem(`documents_${empId}`);
      allDocs[empId] = stored ? JSON.parse(stored) : [];
    }
    setAllDocuments(allDocs);
  };

  const loadNotices = () => {
    const allNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    setNotices(allNotices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const sendNotice = (notice) => {
    const allNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    const newNoticeObj = { id: Date.now(), ...notice, createdAt: new Date().toISOString(), createdBy: user?.id || 'ADMIN' };
    allNotices.unshift(newNoticeObj);
    localStorage.setItem('notices', JSON.stringify(allNotices));
    loadNotices();
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    const empIds = Object.keys(passwordSystem).filter(id => id !== 'ADMIN');
    for (const empId of empIds) {
      sendNotification(`📢 NEW NOTICE: ${notice.title}`, notice.content.substring(0, 100) + (notice.content.length > 100 ? '...' : ''), 'notice', 'staff', empId);
    }
    logActivity('NOTICE_SENT', `Notice: ${notice.title}`);
    return true;
  };

  const sendAnnouncement = () => {
    if (!announcementText.trim()) { alert('Please enter announcement text'); return; }
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    const empIds = Object.keys(passwordSystem).filter(id => id !== 'ADMIN');
    for (const empId of empIds) {
      sendNotification('📢 ANNOUNCEMENT', announcementText, 'announcement', 'staff', empId);
    }
    logActivity('ANNOUNCEMENT_SENT', announcementText.substring(0, 100));
    setAnnouncementText('');
    setShowAnnouncementModal(false);
    alert('Announcement sent to all staff!');
  };

  const adminChangePassword = (userId, oldPassword, newPassword) => {
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    if (!passwordSystem[userId]) return false;
    if (passwordSystem[userId].password !== btoa(oldPassword)) return false;
    passwordSystem[userId].password = btoa(newPassword);
    passwordSystem[userId].lastReset = new Date().toISOString();
    localStorage.setItem('passwordSystem', JSON.stringify(passwordSystem));
    logActivity('ADMIN_PASSWORD_CHANGE', `${userId} changed own password`);
    return true;
  };

  const adminResetPassword = (userId, newPassword) => {
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    if (!passwordSystem[userId]) return false;
    passwordSystem[userId].password = btoa(newPassword);
    passwordSystem[userId].lastReset = new Date().toISOString();
    passwordSystem[userId].resetBy = 'ADMIN';
    localStorage.setItem('passwordSystem', JSON.stringify(passwordSystem));
    sendNotification('🔐 Password Reset', `Admin has reset your password.`, 'security', 'staff', userId);
    logActivity('PASSWORD_RESET', `Admin reset password for ${userId}`);
    return true;
  };

  const bulkResetPasswords = () => {
    if (!bulkResetPassword || bulkResetPassword.length < 6) { alert('Password must be at least 6 characters'); return; }
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    const empIds = Object.keys(passwordSystem).filter(id => id !== 'ADMIN');
    for (const empId of empIds) {
      passwordSystem[empId].password = btoa(bulkResetPassword);
      passwordSystem[empId].lastReset = new Date().toISOString();
      passwordSystem[empId].resetBy = 'ADMIN_BULK';
      sendNotification('🔐 Password Reset', `Admin has reset all staff passwords.`, 'security', 'staff', empId);
    }
    localStorage.setItem('passwordSystem', JSON.stringify(passwordSystem));
    logActivity('BULK_PASSWORD_RESET', `Reset all ${empIds.length} staff passwords`);
    setBulkResetPassword('');
    setShowBulkResetModal(false);
    alert(`Successfully reset passwords for ${empIds.length} staff members!`);
  };

  // ============================
  // ✅ CHANGED: createStaffAccount — now saves to MongoDB so all devices see the new staff
  // ============================
  const createStaffAccount = async () => {
    if (!newStaffId || !newStaffId.trim()) { alert('Please enter a valid Staff ID'); return; }
    const staffId = newStaffId.trim().toUpperCase();
    if (staffId === 'ADMIN') { alert('Cannot create ADMIN account via this method'); return; }
    if (!newStaffPasswordCreate || newStaffPasswordCreate.length < 6) { alert('Password must be at least 6 characters long'); return; }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/create-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: staffId,
          password: newStaffPasswordCreate,
          name: staffId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create staff account');
        return;
      }

      // Initialize localStorage data buckets for this new staff member
      if (!localStorage.getItem(`workData_${staffId}`))
        localStorage.setItem(`workData_${staffId}`, JSON.stringify([]));
      if (!localStorage.getItem(`attendance_${staffId}`))
        localStorage.setItem(`attendance_${staffId}`, JSON.stringify([]));
      if (!localStorage.getItem(`documents_${staffId}`))
        localStorage.setItem(`documents_${staffId}`, JSON.stringify([]));

      // Also add to local passwordSystem so current device sees the staff immediately
      const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
      passwordSystem[staffId] = {
        resetCount: 0,
        lastReset: null,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('passwordSystem', JSON.stringify(passwordSystem));

      sendNotification('🆕 New Account Created', `You have been added as an enumerator. Staff ID: ${staffId}.`, 'security', 'staff', staffId);
      logActivity('STAFF_CREATED', `Created new staff via MongoDB: ${staffId}`);

      setShowCreateStaffModal(false);
      setNewStaffId('');
      setNewStaffPasswordCreate('');

      // Reload staff list from MongoDB to confirm
      await loadAllStaffData();
      alert(`✅ Staff account ${staffId} created successfully! Visible on all devices.`);
    } catch (err) {
      alert('Network error — could not reach server: ' + err.message);
    }
  };

  // ============================
  // PERMANENT DELETE STAFF
  // ============================
  const openDeleteStaffModal = (staff) => {
    setDeleteStaffTarget(staff);
    setDeleteConfirmText('');
    setDeleteStaffOptions({ deleteWorkData: true, deleteAttendance: true, deleteDocuments: true });
    setShowDeleteStaffModal(true);
  };

  const executeDeleteStaff = () => {
    if (!deleteStaffTarget) return;
    if (deleteConfirmText !== deleteStaffTarget.id) {
      alert(`Please type "${deleteStaffTarget.id}" exactly to confirm deletion.`);
      return;
    }

    const staffId = deleteStaffTarget.id;

    // Remove from password system
    const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    delete passwordSystem[staffId];
    localStorage.setItem('passwordSystem', JSON.stringify(passwordSystem));

    // Remove selected data
    if (deleteStaffOptions.deleteWorkData) localStorage.removeItem(`workData_${staffId}`);
    if (deleteStaffOptions.deleteAttendance) localStorage.removeItem(`attendance_${staffId}`);
    if (deleteStaffOptions.deleteDocuments) localStorage.removeItem(`documents_${staffId}`);

    // Remove from suspended list
    const suspended = JSON.parse(localStorage.getItem('suspendedStaff') || '[]');
    localStorage.setItem('suspendedStaff', JSON.stringify(suspended.filter(id => id !== staffId)));

    // Remove all notifications for this staff
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify(allNotifs.filter(n => n.employeeId !== staffId)));

    logActivity('STAFF_PERMANENTLY_DELETED', `Permanently deleted staff: ${staffId}. WorkData: ${deleteStaffOptions.deleteWorkData}, Attendance: ${deleteStaffOptions.deleteAttendance}, Documents: ${deleteStaffOptions.deleteDocuments}`);

    setShowDeleteStaffModal(false);
    setDeleteStaffTarget(null);
    setDeleteConfirmText('');

    if (selectedStaff?.id === staffId) setSelectedStaff(null);

    loadAllStaffData();
    loadAllAttendanceData();
    loadAllDocuments();

    alert(`✅ Staff ${staffId} has been permanently deleted from the system.`);
  };

  const executeSuspend = () => {
    if (!suspendTarget || !suspendReason.trim()) { alert('Please provide a reason for suspension.'); return; }
    const updated = [...suspendedStaff, suspendTarget.id];
    setSuspendedStaff(updated);
    localStorage.setItem('suspendedStaff', JSON.stringify(updated));
    sendNotification('🚫 Account Suspended', `Your account has been suspended. Reason: ${suspendReason}. Duration: ${suspendDurationHours} hours.`, 'security', 'staff', suspendTarget.id);
    logActivity('STAFF_SUSPENDED', `Suspended ${suspendTarget.id}: ${suspendReason}`);
    setShowSuspendModal(false);
    loadAllStaffData();
  };

  const unsuspendStaff = (empId) => {
    if (!window.confirm(`Unsuspend ${empId}? They will regain login access.`)) return;
    const updated = suspendedStaff.filter(id => id !== empId);
    setSuspendedStaff(updated);
    localStorage.setItem('suspendedStaff', JSON.stringify(updated));
    sendNotification('✅ Account Reinstated', `Your account suspension has been lifted.`, 'security', 'staff', empId);
    logActivity('STAFF_UNSUSPENDED', `Unsuspended ${empId}`);
    loadAllStaffData();
  };

  const exportReport = (selectedStaffData) => {
    if (!selectedStaffData) return;
    const entries = getFilteredAdminEntries(selectedStaffData.id);
    const attendance = getStaffAttendance(selectedStaffData.id);
    const csvContent = [
      ['District Economic Census Office, Dolakha - Staff Report'],
      [`Staff ID: ${selectedStaffData.id}`],
      [`Report Generated: ${new Date().toLocaleString()}`],
      [''],
      ['DETAILED CENSUS ENTRIES'],
      ['Date', 'Total Count', 'Census Token', 'Hours Worked', 'Status', 'Description', 'Has Photo'],
      ...entries.map(e => [e.date, e.totalCount, e.censusToken, e.hoursWorked, e.status, e.description, e.hasPhoto ? 'Yes' : 'No']),
      [''],
      ['DETAILED ATTENDANCE RECORDS'],
      ['Date', 'Check In', 'Check Out', 'Status', 'Distance (m)', 'Location'],
      ...attendance.map(a => [a.date, a.checkIn || '-', a.checkOut || '-', a.status, a.distanceFromOffice || '-', a.locationPlaceName || '-'])
    ];
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedStaffData.id}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity('REPORT_EXPORTED', `Exported report for ${selectedStaffData.id}`);
  };

  const exportAllData = () => {
    const allData = staffList.map(staff => {
      const entries = allWorkData[staff.id] || [];
      const attendance = allAttendanceData[staff.id] || [];
      return {
        staffId: staff.id, totalCount: staff.totalCount, tokenCount: staff.tokenCount,
        attendanceRate: staff.attendanceRate,
        entries: entries.map(e => ({ date: e.date, totalCount: e.totalCount, token: e.censusToken, hours: e.hoursWorked, status: e.status })),
        attendance: attendance.map(a => ({ date: a.date, checkIn: a.checkIn, checkOut: a.checkOut, status: a.status, location: a.locationPlaceName }))
      };
    });
    const jsonStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_staff_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity('ALL_DATA_EXPORTED', 'Exported complete staff data');
    setShowExportModal(false);
  };

  const getFilteredAdminEntries = (staffId) => {
    if (!staffId || !allWorkData[staffId]) return [];
    let entries = [...allWorkData[staffId]];
    if (dateRange.start) entries = entries.filter(e => e.date >= dateRange.start);
    if (dateRange.end) entries = entries.filter(e => e.date <= dateRange.end);
    return entries;
  };

  const getStaffAttendance = (empId) => allAttendanceData[empId] || [];
  const getStaffDocuments = (empId) => allDocuments[empId] || [];

  const getFilteredStaffByStatus = () => {
    const base = staffList.filter(staff =>
      staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedStatusFilter === 'all') return base;
    if (selectedStatusFilter === 'pending') return base.filter(s => s.pendingTasks > 0);
    if (selectedStatusFilter === 'in-progress') return base.filter(s => s.inProgressTasks > 0);
    if (selectedStatusFilter === 'completed') return base.filter(s => s.completedTasks > 0);
    if (selectedStatusFilter === 'suspended') return base.filter(s => s.suspended);
    if (selectedStatusFilter === 'present') return base.filter(s => todayAttendance.present.includes(s.id));
    if (selectedStatusFilter === 'halfday') return base.filter(s => todayAttendance.halfDay.includes(s.id));
    if (selectedStatusFilter === 'absent') return base.filter(s => todayAttendance.absent.includes(s.id));
    return base;
  };

  const getOverallStats = () => {
    const totalStaff = staffList.length;
    const totalCensusCount = staffList.reduce((sum, s) => sum + s.totalCount, 0);
    const totalTokens = staffList.reduce((sum, s) => sum + s.tokenCount, 0);
    const avgAttendance = totalStaff > 0 ? (staffList.reduce((sum, s) => sum + parseInt(s.attendanceRate), 0) / totalStaff).toFixed(1) : 0;
    const totalDocuments = staffList.reduce((sum, s) => sum + s.documentCount, 0);
    const totalCompleted = staffList.reduce((sum, s) => sum + s.completedTasks, 0);
    const totalPending = staffList.reduce((sum, s) => sum + s.pendingTasks, 0);
    const totalInProgress = staffList.reduce((sum, s) => sum + s.inProgressTasks, 0);
    return { totalStaff, totalCensusCount, totalTokens, avgAttendance, totalDocuments, presentToday: todayAttendance.present.length, halfDayToday: todayAttendance.halfDay.length, totalCompleted, totalPending, totalInProgress, totalSuspended: suspendedStaff.length };
  };

  const formatLastUpdated = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportAndSaveFile = (doc, staffId) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity('FILE_EXPORT', `Exported ${doc.name} from ${staffId}`);
  };

  const handleAdminChangePassword = (e) => {
    e.preventDefault();
    if (adminPwdData.newPassword !== adminPwdData.confirmPassword) { alert('New passwords do not match'); return; }
    if (adminPwdData.newPassword.length < 6) { alert('Password must be at least 6 characters'); return; }
    if (adminChangePassword('ADMIN', adminPwdData.currentPassword, adminPwdData.newPassword)) {
      alert('Password changed successfully! Please login again.');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.reload();
    } else alert('Current password is incorrect');
  };

  // ============================
  // EFFECTS
  // ============================
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') { setDarkMode(true); document.body.classList.add('dark-mode'); }

    // ✅ CHANGED: loadAllStaffData is now async
    loadAllStaffData().catch(console.error);
    loadAllAttendanceData();
    loadAllDocuments();
    loadNotices();
    const archives = JSON.parse(localStorage.getItem('dataArchives') || '[]');
    setDataArchives(archives);
    const suspended = JSON.parse(localStorage.getItem('suspendedStaff') || '[]');
    setSuspendedStaff(suspended);
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    setActivityLogs(logs.slice(0, 100));
  }, []);

  useEffect(() => {
    if (darkMode) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); }
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); }
  }, [darkMode]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // ✅ CHANGED: loadAllStaffData is now async
        loadAllStaffData().catch(console.error);
        loadAllAttendanceData();
        loadAllDocuments();
        setLastUpdated(new Date());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // ============================
  // RENDER
  // ============================
  const filteredStaffByStatus = getFilteredStaffByStatus();
  const stats = getOverallStats();

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark' : ''}`}>

      {/* Admin Toolbar */}
      <div className="admin-toolbar">
        <div className="toolbar-brand">
          <span className="toolbar-logo">🏛️</span>
          <div>
            <div className="toolbar-title">District Economic Census</div>
            <div className="toolbar-sub">Dolakha · Admin Control Panel</div>
          </div>
        </div>
        <div className="toolbar-actions">
          <button className="tb-btn" onClick={() => setShowCreateStaffModal(true)} title="Create Staff">➕ New Staff</button>
          <button className="tb-btn" onClick={() => setShowAnnouncementModal(true)} title="Send Announcement">📣 Announce</button>
          <button className="tb-btn" onClick={() => setShowNoticeModal(true)} title="Send Notice">📢 Notice</button>
          <button className="tb-btn" onClick={() => setShowBulkResetModal(true)} title="Bulk Reset">🔄 Bulk Reset</button>
          <button className="tb-btn" onClick={() => setShowExportModal(true)} title="Export Data">📥 Export</button>
          <button className="tb-btn" onClick={() => setShowActivityLogModal(true)} title="Activity Log">📋 Logs</button>
          <button className="tb-btn" onClick={() => setShowAdminChangePwdModal(true)} title="Change Password">🔐 Password</button>
          <button className={`tb-btn toggle-btn ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="last-updated-bar last-updated-bar-hover">
        <span className={`lu-dot ${!autoRefresh ? 'paused' : ''}`}></span>
        <span>Last updated: <strong>{formatLastUpdated(lastUpdated)}</strong></span>
        {autoRefresh && <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '11px' }}>• Auto-refreshing every 10s</span>}
        <div className="toggle-switch">
          <span>Auto Refresh</span>
          <input type="checkbox" checked={autoRefresh} onChange={() => setAutoRefresh(!autoRefresh)} />
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="status-bar">
        {[
          { key: 'all', label: 'All Enumerators', cls: '' },
          { key: 'pending', label: '⏳ Pending', cls: 'pend' },
          { key: 'in-progress', label: '🔄 In Progress', cls: 'prog' },
          { key: 'completed', label: '✅ Completed', cls: 'comp' },
          { key: 'suspended', label: '🚫 Suspended', cls: 'susp' },
          { key: 'present', label: '🟢 Present Today', cls: 'comp' },
          { key: 'halfday', label: '🟡 Half Day Today', cls: 'pend' },
          { key: 'absent', label: '🔴 Absent Today', cls: 'susp' },
        ].map(f => (
          <button key={f.key} className={`sf-btn sf-btn-hover ${f.cls} ${selectedStatusFilter === f.key ? 'active' : ''}`} onClick={() => setSelectedStatusFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {[
          { icon: '👥', label: 'Total Enumerators', value: stats.totalStaff, color: 'blue' },
          { icon: '📊', label: 'Total Census Count', value: stats.totalCensusCount.toLocaleString(), color: 'green' },
          { icon: '🎫', label: 'Total Tokens', value: stats.totalTokens, color: 'purple' },
          { icon: '📈', label: 'Avg Attendance', value: `${stats.avgAttendance}%`, color: 'amber' },
          { icon: '📄', label: 'Total Documents', value: stats.totalDocuments, color: 'teal' },
          { icon: '🟢', label: 'Present Today', value: stats.presentToday, color: 'green' },
          { icon: '🟡', label: 'Half Day Today', value: stats.halfDayToday, color: 'amber' },
          { icon: '🚫', label: 'Suspended', value: stats.totalSuspended, color: 'red' },
        ].map((s, i) => (
          <div key={i} className={`stat-card stat-card-hover stat-${s.color}`}>
            <span className="stat-icon">{s.icon}</span>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Attendance Summary */}
      <div className="today-att today-att-hover">
        <h3>📊 Today's Attendance Summary</h3>
        <div className="att-chips">
          <div className="att-chip present att-chip-hover">
            <span className="count">{todayAttendance.present.length}</span>
            <span className="label">Present (Full Day)</span>
          </div>
          <div className="att-chip late att-chip-hover">
            <span className="count">{todayAttendance.halfDay.length}</span>
            <span className="label">Half Day</span>
          </div>
          <div className="att-chip absent att-chip-hover">
            <span className="count">{todayAttendance.absent.length}</span>
            <span className="label">Absent / No Check-in</span>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="task-cards">
        <div className="task-card pend task-card-hover">
          <span className="task-card-icon">⏳</span>
          <div>
            <div className="task-title">Pending Tasks</div>
            <div className="task-count">{stats.totalPending}</div>
            <div className="task-sub">Across all enumerators</div>
          </div>
        </div>
        <div className="task-card prog task-card-hover">
          <span className="task-card-icon">🔄</span>
          <div>
            <div className="task-title">In Progress</div>
            <div className="task-count">{stats.totalInProgress}</div>
            <div className="task-sub">Active assignments</div>
          </div>
        </div>
        <div className="task-card comp task-card-hover">
          <span className="task-card-icon">✅</span>
          <div>
            <div className="task-title">Completed</div>
            <div className="task-count">{stats.totalCompleted}</div>
            <div className="task-sub">Successfully finished</div>
          </div>
        </div>
      </div>

      {/* Performance Summary Table */}
      <div className="table-section table-section-hover">
        <h3>📊 Performance Summary</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: '500px' }}>
            <thead>
              <tr><th>Staff ID</th><th>Total Count</th><th>Tokens</th><th>Attendance %</th><th>Completion %</th><th>Pending</th><th>Progress</th></tr>
            </thead>
            <tbody>
              {performanceData.slice(0, 5).map(p => (
                <tr key={p.id} className="table-row-hover">
                  <td><strong>{p.id}</strong></td>
                  <td>{p.totalCount}</td>
                  <td>{p.tokenCount}</td>
                  <td>{p.attendanceRate}%</td>
                  <td>{p.completionRate}%</td>
                  <td>{p.pendingTasks}</td>
                  <td>{p.inProgressTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="notices-section notices-section-hover">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '11px' }}>
          <h3>📢 Recent Official Notices</h3>
          <button className="add-btn small add-btn-hover" onClick={() => setShowNoticeModal(true)}>+ New Notice</button>
        </div>
        {notices.slice(0, 3).map(n => (
          <div key={n.id} className={`notice-card notice-card-hover notice-${n.priority}`}>
            <div className="notice-head">
              <span className="notice-title">{n.title}</span>
              <span className="notice-date">{new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="notice-content">{n.content.substring(0, 100)}...</div>
          </div>
        ))}
        {notices.length === 0 && <p style={{ fontSize: '12px', color: '#bbb' }}>No notices yet.</p>}
      </div>

      {/* Main Admin Layout */}
      <div className="admin-layout">
        {/* Staff Sidebar */}
        <div className="staff-sidebar staff-sidebar-hover">
          <div className="sidebar-header-row">
            <h2>📋 Enumerator Directory</h2>
            <span className="staff-count-badge">{filteredStaffByStatus.length}</span>
          </div>
          <input
            type="text"
            placeholder="🔍 Search by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input search-input-hover"
          />
          <div className="staff-list">
            {filteredStaffByStatus.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#bbb', padding: '18px', fontSize: '12px' }}>No staff found</div>
            ) : filteredStaffByStatus.map(staff => {
              let attendanceDisplay = staff.attendanceDisplay || '🔴 Absent';
              let indicatorColor = '#ef4444';
              if (todayAttendance.present.includes(staff.id)) { attendanceDisplay = '🟢 Present'; indicatorColor = '#22c55e'; }
              else if (todayAttendance.halfDay.includes(staff.id)) { attendanceDisplay = '🟡 Half Day'; indicatorColor = '#f59e0b'; }

              return (
                <div
                  key={staff.id}
                  className={`staff-item staff-item-hover ${selectedStaff?.id === staff.id ? 'active' : ''} ${staff.suspended ? 'suspended-item' : ''}`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <div className="staff-avatar" style={{ background: staff.suspended ? '#ef4444' : 'linear-gradient(135deg, #3730a3, #4f46e5)' }}>
                    {staff.id.slice(-2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="staff-id">
                      {staff.id}
                      <span style={{ marginLeft: '6px', fontSize: '11px', color: indicatorColor }}>{attendanceDisplay}</span>
                      {staff.suspended && <span className="tbadge susp" style={{ marginLeft: '6px' }}>🚫</span>}
                    </div>
                    <div className="staff-mini-stats">
                      <span>📊{staff.totalCount}</span>
                      <span>🎫{staff.tokenCount}</span>
                      <span>📈{staff.attendanceRate}%</span>
                    </div>
                    <div className="task-badges">
                      {staff.pendingTasks > 0 && <span className="tbadge pend">⏳{staff.pendingTasks}</span>}
                      {staff.inProgressTasks > 0 && <span className="tbadge prog">🔄{staff.inProgressTasks}</span>}
                      {staff.completedTasks > 0 && <span className="tbadge comp">✅{staff.completedTasks}</span>}
                    </div>
                  </div>
                  <div className="staff-item-actions">
                    <button className="rt-btn rt-btn-hover" onClick={(e) => { e.stopPropagation(); setSelectedRealTimeStaff(staff); setShowRealTimeModal(true); }} title="Real-time Data">📡</button>
                    <button className="del-staff-btn" onClick={(e) => { e.stopPropagation(); openDeleteStaffModal(staff); }} title="Permanently Delete Staff">🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work Content Area */}
        <div className="work-content work-content-hover">
          {selectedStaff ? (
            <>
              <div className="staff-header staff-header-hover">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '11px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                      <h2>{selectedStaff.id} — {selectedStaff.name}</h2>
                      {selectedStaff.suspended && <span className="suspended-badge">🚫 SUSPENDED</span>}
                      {todayAttendance.present.includes(selectedStaff.id) && <span className="suspended-badge" style={{ background: '#dcfce7', color: '#166534' }}>🟢 Present Today</span>}
                      {todayAttendance.halfDay.includes(selectedStaff.id) && <span className="suspended-badge" style={{ background: '#fef9c3', color: '#92400e' }}>🟡 Half Day</span>}
                      {todayAttendance.absent.includes(selectedStaff.id) && <span className="suspended-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>🔴 Absent Today</span>}
                    </div>
                    <div className="summary-chips">
                      {[
                        `📊 Census: ${selectedStaff.totalCount}`,
                        `🎫 Tokens: ${selectedStaff.tokenCount}`,
                        `✅ Done: ${selectedStaff.completedTasks}`,
                        `⏳ Pending: ${selectedStaff.pendingTasks}`,
                        `🔄 In Progress: ${selectedStaff.inProgressTasks}`,
                        `📄 Docs: ${selectedStaff.documentCount}`,
                        `📈 Attendance: ${selectedStaff.attendanceRate}%`
                      ].map((c, i) => <span key={i} className="schip schip-hover">{c}</span>)}
                    </div>
                  </div>
                  <div className="staff-actions">
                    <button className="act-btn reset act-btn-hover" onClick={() => { setSelectedStaffForReset(selectedStaff); setShowResetModal(true); }}>🔐 Reset Pwd</button>
                    <button className="act-btn export act-btn-hover" onClick={() => exportReport(selectedStaff)}>📥 Export</button>
                    <button className="act-btn rt act-btn-hover" onClick={() => { setSelectedRealTimeStaff(selectedStaff); setShowRealTimeModal(true); }}>📡 Live</button>
                    {selectedStaff.suspended ? (
                      <button className="act-btn unsuspend act-btn-hover" onClick={() => unsuspendStaff(selectedStaff.id)}>✅ Unsuspend</button>
                    ) : (
                      <button className="act-btn suspend act-btn-hover" onClick={() => { setSuspendTarget(selectedStaff); setShowSuspendModal(true); }}>🚫 Suspend</button>
                    )}
                    <button className="act-btn delete-staff act-btn-hover" onClick={() => openDeleteStaffModal(selectedStaff)}>🗑️ Delete Staff</button>
                  </div>
                </div>
                <div className="last-active-row">
                  <span>🕐</span><span>Last active: </span>
                  <strong>{selectedStaff.lastActive ? formatLastUpdated(selectedStaff.lastActive) : 'No activity'}</strong>
                  {selectedStaff.lastActive && <span style={{ color: '#bbb', fontSize: '10px' }}>({selectedStaff.lastActive.toLocaleString()})</span>}
                  {selectedStaff.createdAt && <span style={{ color: '#bbb', fontSize: '10px', marginLeft: '10px' }}>Created: {new Date(selectedStaff.createdAt).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="filter-bar filter-bar-hover">
                <label>Date Range:</label>
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="input-hover" />
                <span>to</span>
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="input-hover" />
                {(dateRange.start || dateRange.end) && <button className="clear-btn clear-btn-hover" onClick={() => setDateRange({ start: '', end: '' })}>✕ Clear</button>}
              </div>

              <div className="table-section table-section-hover">
                <h3>📊 Census Entries</h3>
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Total Count</th><th>Census Token</th><th>Hours</th><th>Status</th><th>Photo</th></tr></thead>
                  <tbody>
                    {getFilteredAdminEntries(selectedStaff.id).length === 0 ? (
                      <tr><td colSpan="6" className="no-data">No entries found</td></tr>
                    ) : getFilteredAdminEntries(selectedStaff.id).map(entry => (
                      <tr key={entry.id} className="table-row-hover">
                        <td><span className="date-badge">{entry.date}</span></td>
                        <td><strong>{entry.totalCount}</strong></td>
                        <td><span className="token-badge">{entry.censusToken}</span></td>
                        <td>{entry.hoursWorked}h</td>
                        <td><span className={`sbadge ${entry.status}`}>{entry.status}</span></td>
                        <td>{entry.hasPhoto ? <span style={{ fontSize: '16px' }}>📸</span> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-section table-section-hover">
                <h3>📋 Attendance Records</h3>
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Distance (m)</th><th>Location</th><th>Coordinates</th></tr></thead>
                  <tbody>
                    {getStaffAttendance(selectedStaff.id).length === 0 ? (
                      <tr><td colSpan="7" className="no-data">No attendance records</td></tr>
                    ) : getStaffAttendance(selectedStaff.id).map(att => (
                      <tr key={att.id} className="table-row-hover">
                        <td><span className="date-badge">{att.date}</span></td>
                        <td>{att.checkIn || '—'}</td>
                        <td>{att.checkOut || '—'}</td>
                        <td><span className={`sbadge ${att.status === 'Present' ? 'Present' : att.status === 'Half Day' ? 'Late' : 'Absent'}`}>{att.status || '—'}</span></td>
                        <td>{att.distanceFromOffice ? `${att.distanceFromOffice}m` : '—'}</td>
                        <td>{att.locationPlaceName ? (att.locationPlaceName.length > 30 ? att.locationPlaceName.substring(0, 30) + '...' : att.locationPlaceName) : '—'}</td>
                        <td>{att.location ? `${att.location.lat.toFixed(4)},${att.location.lng.toFixed(4)}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="docs-section docs-section-hover">
                <h3>📄 Uploaded Documents</h3>
                {getStaffDocuments(selectedStaff.id).length === 0 ? (
                  <p className="no-data">No documents uploaded</p>
                ) : (
                  <div className="docs-grid">
                    {getStaffDocuments(selectedStaff.id).map(doc => (
                      <div key={doc.id} className="doc-card doc-card-hover">
                        <div className="doc-icon-big">📄</div>
                        <div style={{ flex: 1 }}>
                          <div className="doc-name">{doc.name}</div>
                          <div className="doc-type">{doc.type}</div>
                          <div className="doc-desc">{doc.description}</div>
                          <div className="doc-date">{new Date(doc.uploadDate).toLocaleDateString()}</div>
                          <div className="doc-acts">
                            <button onClick={() => exportAndSaveFile(doc, selectedStaff.id)} className="dl-link dl-link-hover" title="Download File">📎 Download</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection no-selection-hover">
              <div className="no-sel-icon">👈</div>
              <p>Select an enumerator from the left to view their work, attendance, and documents</p>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#888' }}>You can also permanently delete staff using the 🗑️ button in the sidebar</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Record Management */}
      <FormRecordManagement />

      {/* ===== MODALS ===== */}

      {/* PERMANENT DELETE STAFF MODAL */}
      {showDeleteStaffModal && deleteStaffTarget && (
        <div className="modal-overlay" onClick={() => setShowDeleteStaffModal(false)}>
          <div className="modal-box delete-staff-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-warning-icon">⚠️</div>
              <h3>Permanently Delete Staff Account</h3>
              <p className="delete-subtitle">This action is <strong>irreversible</strong> and will completely remove this staff member from the system.</p>
            </div>

            <div className="delete-staff-info">
              <div className="delete-staff-id">{deleteStaffTarget.id}</div>
              <div className="delete-staff-stats">
                <span>📊 {deleteStaffTarget.totalCount} census records</span>
                <span>📋 {deleteStaffTarget.attendanceCount} attendance records</span>
                <span>📄 {deleteStaffTarget.documentCount} documents</span>
              </div>
            </div>

            <div className="delete-options">
              <p className="delete-options-label">Select data to delete:</p>
              <label className="delete-checkbox-row">
                <input type="checkbox" checked={deleteStaffOptions.deleteWorkData} onChange={e => setDeleteStaffOptions(p => ({ ...p, deleteWorkData: e.target.checked }))} />
                <span>Delete all work/census entries ({deleteStaffTarget.totalCount} records)</span>
              </label>
              <label className="delete-checkbox-row">
                <input type="checkbox" checked={deleteStaffOptions.deleteAttendance} onChange={e => setDeleteStaffOptions(p => ({ ...p, deleteAttendance: e.target.checked }))} />
                <span>Delete all attendance records ({deleteStaffTarget.attendanceCount} records)</span>
              </label>
              <label className="delete-checkbox-row">
                <input type="checkbox" checked={deleteStaffOptions.deleteDocuments} onChange={e => setDeleteStaffOptions(p => ({ ...p, deleteDocuments: e.target.checked }))} />
                <span>Delete all uploaded documents ({deleteStaffTarget.documentCount} files)</span>
              </label>
              <p className="delete-options-note">⚠️ Account credentials will always be deleted regardless of the above selections.</p>
            </div>

            <div className="delete-confirm-section">
              <p>Type <strong className="delete-id-highlight">{deleteStaffTarget.id}</strong> to confirm permanent deletion:</p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder={`Type "${deleteStaffTarget.id}" to confirm`}
                className="delete-confirm-input"
                autoComplete="off"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteStaffModal(false)}>Cancel</button>
              <button
                className={`btn-permanent-delete ${deleteConfirmText === deleteStaffTarget.id ? 'ready' : ''}`}
                onClick={executeDeleteStaff}
                disabled={deleteConfirmText !== deleteStaffTarget.id}
              >
                🗑️ Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CHANGED: Create Staff Modal — now calls MongoDB API */}
      {showCreateStaffModal && (
        <div className="modal-overlay" onClick={() => setShowCreateStaffModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>➕ Create New Enumerator</h3>
            <p style={{ fontSize: '12px', color: '#22c55e', marginBottom: '12px', background: '#f0fdf4', padding: '8px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              ✅ Staff will be saved to MongoDB — visible on <strong>all devices</strong> instantly.
            </p>
            <div className="form-group-modal">
              <label>Staff ID</label>
              <input type="text" placeholder="e.g. E034" value={newStaffId} onChange={e => setNewStaffId(e.target.value.toUpperCase())} className="modal-input input-hover" />
            </div>
            <div className="form-group-modal">
              <label>Initial Password (min 6 chars)</label>
              <input type="password" placeholder="Password" value={newStaffPasswordCreate} onChange={e => setNewStaffPasswordCreate(e.target.value)} className="modal-input input-hover" />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowCreateStaffModal(false)}>Cancel</button>
              <button className="btn-primary btn-primary-hover" onClick={createStaffAccount}>✅ Create Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && selectedStaffForReset && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>🔐 Reset Password: {selectedStaffForReset.id}</h3>
            <div className="form-group-modal">
              <label>New Password</label>
              <input type="password" placeholder="New Password" value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)} className="modal-input input-hover" />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowResetModal(false)}>Cancel</button>
              <button className="btn-primary btn-primary-hover" onClick={() => { adminResetPassword(selectedStaffForReset.id, newStaffPassword); setShowResetModal(false); alert('Password reset successful'); }}>Reset Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && suspendTarget && (
        <div className="modal-overlay" onClick={() => setShowSuspendModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>🚫 Suspend: {suspendTarget.id}</h3>
            <div className="form-group-modal">
              <label>Reason for Suspension</label>
              <textarea placeholder="Reason for suspension" value={suspendReason} onChange={e => setSuspendReason(e.target.value)} rows="3" className="modal-textarea textarea-hover" />
            </div>
            <div className="form-group-modal">
              <label>Duration (hours)</label>
              <input type="number" value={suspendDurationHours} onChange={e => setSuspendDurationHours(parseInt(e.target.value))} className="modal-input input-hover" />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowSuspendModal(false)}>Cancel</button>
              <button className="btn-danger btn-danger-hover" onClick={executeSuspend}>🚫 Confirm Suspend</button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Modal */}
      {showRealTimeModal && selectedRealTimeStaff && (
        <div className="modal-overlay" onClick={() => setShowRealTimeModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>📡 Live Data: {selectedRealTimeStaff.id}</h3>
            <div className="realtime-grid">
              {[
                { label: 'Total Census Count', value: selectedRealTimeStaff.totalCount, icon: '📊' },
                { label: 'Tokens Issued', value: selectedRealTimeStaff.tokenCount, icon: '🎫' },
                { label: 'Attendance Rate', value: `${selectedRealTimeStaff.attendanceRate}%`, icon: '📈' },
                { label: 'Pending Tasks', value: selectedRealTimeStaff.pendingTasks, icon: '⏳' },
                { label: 'In Progress', value: selectedRealTimeStaff.inProgressTasks, icon: '🔄' },
                { label: 'Completed', value: selectedRealTimeStaff.completedTasks, icon: '✅' },
                { label: 'Documents', value: selectedRealTimeStaff.documentCount, icon: '📄' },
              ].map((item, i) => (
                <div key={i} className="realtime-stat">
                  <span className="rt-icon">{item.icon}</span>
                  <div>
                    <div className="rt-label">{item.label}</div>
                    <div className="rt-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {selectedRealTimeStaff.lastActive && (
              <p className="rt-last-active">🕐 Last Active: {selectedRealTimeStaff.lastActive.toLocaleString()}</p>
            )}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowRealTimeModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {showNoticeModal && (
        <div className="modal-overlay" onClick={() => setShowNoticeModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>📢 Send Notice to All Staff</h3>
            <div className="form-group-modal">
              <label>Title</label>
              <input type="text" placeholder="Notice title" value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} className="modal-input input-hover" />
            </div>
            <div className="form-group-modal">
              <label>Content</label>
              <textarea placeholder="Notice content..." value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} rows="5" className="modal-textarea textarea-hover" />
            </div>
            <div className="form-group-modal">
              <label>Priority</label>
              <select value={newNotice.priority} onChange={e => setNewNotice({ ...newNotice, priority: e.target.value })} className="modal-select select-hover">
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowNoticeModal(false)}>Cancel</button>
              <button className="btn-primary btn-primary-hover" onClick={() => { sendNotice(newNotice); setShowNoticeModal(false); alert('Notice sent'); }}>📢 Send Notice</button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>📣 Send Announcement</h3>
            <p className="info-text">Announcements appear in staff notifications as popup alerts.</p>
            <div className="form-group-modal">
              <label>Message</label>
              <textarea placeholder="Announcement message..." value={announcementText} onChange={e => setAnnouncementText(e.target.value)} rows="4" className="modal-textarea textarea-hover" />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAnnouncementModal(false)}>Cancel</button>
              <button className="btn-primary btn-primary-hover" onClick={sendAnnouncement}>📣 Send to All</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reset Modal */}
      {showBulkResetModal && (
        <div className="modal-overlay" onClick={() => setShowBulkResetModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>🔄 Bulk Password Reset</h3>
            <p className="warn-text">⚠️ This will reset ALL staff passwords. They will receive notification.</p>
            <div className="form-group-modal">
              <label>New Password for All Staff (min 6 chars)</label>
              <input type="password" placeholder="New password" value={bulkResetPassword} onChange={e => setBulkResetPassword(e.target.value)} className="modal-input input-hover" />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowBulkResetModal(false)}>Cancel</button>
              <button className="btn-danger btn-danger-hover" onClick={bulkResetPasswords}>🔄 Confirm Bulk Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>📥 Export All Staff Data</h3>
            <p className="info-text">Export complete staff data including work entries, attendance, and documents as JSON.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowExportModal(false)}>Cancel</button>
              <button className="btn-primary btn-primary-hover" onClick={exportAllData}>📥 Export JSON</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Change Modal */}
      {showAdminChangePwdModal && (
        <div className="modal-overlay" onClick={() => setShowAdminChangePwdModal(false)}>
          <div className="modal-box modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>🔐 Change Admin Password</h3>
            <div className="form-group-modal">
              <label>Current Password</label>
              <input type="password" placeholder="Current password" value={adminPwdData.currentPassword} onChange={e => setAdminPwdData({ ...adminPwdData, currentPassword: e.target.value })} className="modal-input input-hover" />
            </div>
            <div className="form-group-modal">
              <label>New Password</label>
              <input type="password" placeholder="New password" value={adminPwdData.newPassword} onChange={e => setAdminPwdData({ ...adminPwdData, newPassword: e.target.value })} className="modal-input input-hover" />
            </div>
            <div className="form-group-modal">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" value={adminPwdData.confirmPassword} onChange={e => setAdminPwdData({ ...adminPwdData, confirmPassword: e.target.value })} className="modal-input input-hover" />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAdminChangePwdModal(false)}>Cancel</button>
              <button className="btn-primary btn-primary-hover" onClick={handleAdminChangePassword}>🔐 Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="modal-overlay" onClick={() => setShowArchiveModal(false)}>
          <div className="modal-box xlarge modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>📦 Data Archive Store</h3>
            <p className="info-text">Daily snapshots saved at 1:00 AM.</p>
            {dataArchives.length === 0 ? (
              <p className="no-data">No archives yet.</p>
            ) : (
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {dataArchives.map(archive => (
                  <div key={archive.id} className="archive-card archive-card-hover">
                    <div className="archive-date">📅 {archive.date}</div>
                    <div className="archive-stats">📊 Total Counts: {archive.totalCounts?.toLocaleString()} | 🎫 Tokens: {archive.eCensusTokens}</div>
                    <div className="archive-stats">🕐 Archived: {new Date(archive.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowArchiveModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLogModal && (
        <div className="modal-overlay" onClick={() => setShowActivityLogModal(false)}>
          <div className="modal-box xlarge modal-box-hover" onClick={e => e.stopPropagation()}>
            <h3>📋 Activity Log</h3>
            <p className="info-text">Recent system activities and admin actions.</p>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {activityLogs.length === 0 ? (
                <p className="no-data">No activity logs yet.</p>
              ) : activityLogs.map(log => (
                <div key={log.id} className={`archive-card archive-card-hover ${log.action.includes('DELETE') ? 'log-danger' : ''}`} style={{ borderLeftColor: log.action.includes('DELETE') ? '#ef4444' : log.user === 'ADMIN' ? '#4f46e5' : '#22c55e' }}>
                  <div className="archive-date">🕐 {new Date(log.timestamp).toLocaleString()}</div>
                  <div className="archive-stats"><strong>{log.user}</strong> ({log.role}) — <span style={{ color: log.action.includes('DELETE') ? '#ef4444' : 'inherit' }}>{log.action}</span></div>
                  <div className="archive-stats" style={{ fontSize: '11px', color: '#888' }}>{log.details}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowActivityLogModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
