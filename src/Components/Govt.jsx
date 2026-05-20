import React from 'react';
import './Govt.css';

const Govt = () => (
  <div className="govt-header-banner govt-header-hover">
    <div className="govt-logo-left">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnrXBfiUM6Z6vy-HHm1QKLfcO--wfxPlWN6g&s"
        alt="NSO Logo"
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>
    <div className="govt-text">
      <div className="govt-line-1">नेपाल सरकार</div>
      <div className="govt-line-2">प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय</div>
      <div className="govt-line-3">राष्ट्रिय तथ्याङ्क कार्यालय</div>
      <div className="govt-line-highlight">राष्ट्रिय आर्थिक गणना, २०८२</div>
      <div className="govt-line-4">जिल्ला आर्थिक गणना कार्यालय</div>
      <div className="govt-line-5">दोलखा</div>
    </div>
    <div className="govt-logo-right">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/23/Emblem_of_Nepal.svg"
        alt="Emblem of Nepal"
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>
  </div>
);

export default Govt;