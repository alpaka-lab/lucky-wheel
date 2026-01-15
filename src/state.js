export class State {
  constructor() {
    // 1. Set Defaults
    this.participants = [
      { id: 1, name: 'Alice', active: true },
      { id: 2, name: 'Bob', active: true },
      { id: 3, name: 'Charlie', active: true },
    ];
    this.customTitle = '';
    this.duration = 5;
    this.customTitle = '';
    this.duration = 5;
    this.speedLevel = 0.9;
    this.theme = 'default';

    // 2. Hydrate from Storage (overwriting defaults if data exists)
    this.load();

    this.listeners = [];
  }

  get activeParticipants() {
    return this.participants.filter(p => p.active);
  }

  load() {
    const dataStr = localStorage.getItem('wheelData');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        // Handle migration if data was just array or old format
        if (Array.isArray(data)) {
          this.participants = data; // Backward compatibility
        } else {
          this.participants = data.participants || [];
          if (data.customTitle !== undefined) this.customTitle = data.customTitle;
          else if (data.title) this.customTitle = data.title; // Migration

          if (data.duration) this.duration = data.duration;
          if (data.duration) this.duration = data.duration;
          if (data.speedLevel) this.speedLevel = data.speedLevel;
          if (data.theme) this.theme = data.theme;
        }
      } catch (e) {
        console.error('Failed to load state', e);
      }
    } else {
      // Backward compatibility for old 'spinWheelParticipants' key
      const oldParticipantsData = localStorage.getItem('spinWheelParticipants');
      if (oldParticipantsData) {
        try {
          this.participants = JSON.parse(oldParticipantsData);
          // Save in new format and remove old key
          this.save();
          localStorage.removeItem('spinWheelParticipants');
        } catch (e) {
          console.error('Failed to load old participants state', e);
        }
      }
    }
  }

  save() {
    const data = {
      participants: this.participants,
      customTitle: this.customTitle,
      duration: this.duration,
      customTitle: this.customTitle,
      duration: this.duration,
      speedLevel: this.speedLevel,
      theme: this.theme
    };
    localStorage.setItem('wheelData', JSON.stringify(data));
  }

  addParticipant(name) {
    if (!name.trim()) return;
    this.participants.push({
      id: Date.now(),
      name: name.trim(),
      active: true
    });
    this.save();
    this.notify();
  }

  removeParticipant(id) {
    this.participants = this.participants.filter(p => p.id !== id);
    this.save();
    this.notify();
  }

  toggleParticipant(id) {
    const p = this.participants.find(p => p.id === id);
    if (p) {
      p.active = !p.active;
      this.save();
      this.notify();
    }
  }

  shuffleParticipants() {
    for (let i = this.participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.participants[i], this.participants[j]] = [this.participants[j], this.participants[i]];
    }
    this.save();
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Initial call
    listener(this.participants, this.customTitle, this.duration, this.speedLevel, this.theme);
  }

  notify() {
    this.listeners.forEach(l => l(this.participants, this.customTitle, this.duration, this.speedLevel, this.theme));
  }

  updateSettings(title, duration, speedLevel, theme) {
    this.customTitle = title;
    this.duration = duration;
    if (speedLevel) this.speedLevel = parseFloat(speedLevel);
    if (theme) this.theme = theme;
    this.save();
    this.notify();
  }
}
