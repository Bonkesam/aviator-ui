// lib/audio/AudioManager.ts
import { Howl, Howler } from 'howler';

export interface AudioTrack {
  id: string;
  src: string[];
  volume: number;
  loop: boolean;
  spatial?: boolean;
  category: 'engine' | 'ui' | 'ambient' | 'effects';
}

export class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<string, Howl> = new Map();
  private masterVolume: number = 0.7;
  private categoryVolumes: Record<string, number> = {
    engine: 0.8,
    ui: 0.6,
    ambient: 0.4,
    effects: 0.9
  };
  private isInitialized: boolean = false;
  private isMuted: boolean = false;

  // Audio tracks configuration
  private readonly audioTracks: AudioTrack[] = [
    // Engine Sounds
    {
      id: 'engine_idle',
      src: ['/audio/engine/engine_idle.mp3', '/audio/engine/engine_idle.ogg'],
      volume: 0.6,
      loop: true,
      spatial: true,
      category: 'engine'
    },
    {
      id: 'engine_takeoff',
      src: ['/audio/engine/engine_takeoff.mp3', '/audio/engine/engine_takeoff.ogg'],
      volume: 0.8,
      loop: false,
      spatial: true,
      category: 'engine'
    },
    {
      id: 'engine_flight',
      src: ['/audio/engine/engine_flight.mp3', '/audio/engine/engine_flight.ogg'],
      volume: 0.7,
      loop: true,
      spatial: true,
      category: 'engine'
    },
    {
      id: 'propeller',
      src: ['/audio/engine/propeller.mp3', '/audio/engine/propeller.ogg'],
      volume: 0.5,
      loop: true,
      spatial: true,
      category: 'engine'
    },

    // UI Sounds
    {
      id: 'button_click',
      src: ['/audio/ui/button_click.mp3', '/audio/ui/button_click.ogg'],
      volume: 0.4,
      loop: false,
      category: 'ui'
    },
    {
      id: 'button_hover',
      src: ['/audio/ui/button_hover.mp3', '/audio/ui/button_hover.ogg'],
      volume: 0.3,
      loop: false,
      category: 'ui'
    },
    {
      id: 'notification',
      src: ['/audio/ui/notification.mp3', '/audio/ui/notification.ogg'],
      volume: 0.6,
      loop: false,
      category: 'ui'
    },
    {
      id: 'success',
      src: ['/audio/ui/success.mp3', '/audio/ui/success.ogg'],
      volume: 0.7,
      loop: false,
      category: 'ui'
    },
    {
      id: 'error',
      src: ['/audio/ui/error.mp3', '/audio/ui/error.ogg'],
      volume: 0.6,
      loop: false,
      category: 'ui'
    },

    // Ambient Sounds
    {
      id: 'wind',
      src: ['/audio/ambient/wind.mp3', '/audio/ambient/wind.ogg'],
      volume: 0.3,
      loop: true,
      category: 'ambient'
    },
    {
      id: 'airport_ambient',
      src: ['/audio/ambient/airport.mp3', '/audio/ambient/airport.ogg'],
      volume: 0.2,
      loop: true,
      category: 'ambient'
    },

    // Effect Sounds
    {
      id: 'multiplier_hit',
      src: ['/audio/effects/multiplier_hit.mp3', '/audio/effects/multiplier_hit.ogg'],
      volume: 0.8,
      loop: false,
      category: 'effects'
    },
    {
      id: 'crash',
      src: ['/audio/effects/crash.mp3', '/audio/effects/crash.ogg'],
      volume: 0.9,
      loop: false,
      category: 'effects'
    },
    {
      id: 'landing',
      src: ['/audio/effects/landing.mp3', '/audio/effects/landing.ogg'],
      volume: 0.7,
      loop: false,
      category: 'effects'
    },
    {
      id: 'whoosh',
      src: ['/audio/effects/whoosh.mp3', '/audio/effects/whoosh.ogg'],
      volume: 0.5,
      loop: false,
      category: 'effects'
    }
  ];

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set global Howler settings
      Howler.volume(this.masterVolume);
      Howler.html5PoolSize = 10;

      // Load all audio tracks
      await this.loadAudioTracks();
      
      this.isInitialized = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio system:', error);
    }
  }

  private async loadAudioTracks(): Promise<void> {
    const loadPromises = this.audioTracks.map(track => this.loadTrack(track));
    await Promise.all(loadPromises);
  }

  private loadTrack(track: AudioTrack): Promise<void> {
    return new Promise((resolve, reject) => {
      const sound = new Howl({
        src: track.src,
        volume: track.volume * this.categoryVolumes[track.category],
        loop: track.loop,
        html5: !track.spatial, // Use HTML5 for non-spatial audio
        onload: () => {
          this.sounds.set(track.id, sound);
          resolve();
        },
        onloaderror: (id, error) => {
          console.warn(`Failed to load audio track: ${track.id}`, error);
          resolve(); // Don't reject to avoid breaking the whole system
        }
      });
    });
  }

  public play(trackId: string, options?: {
    volume?: number;
    rate?: number;
    fade?: number;
    interrupt?: boolean;
  }): number | null {
    if (this.isMuted || !this.isInitialized) return null;

    const sound = this.sounds.get(trackId);
    if (!sound) {
      console.warn(`Audio track not found: ${trackId}`);
      return null;
    }

    // Stop current instance if interrupt is true
    if (options?.interrupt) {
      sound.stop();
    }

    const soundId = sound.play();

    // Apply options
    if (options?.volume !== undefined) {
      sound.volume(options.volume, soundId);
    }
    if (options?.rate !== undefined) {
      sound.rate(options.rate, soundId);
    }
    if (options?.fade !== undefined) {
      sound.fade(0, sound.volume(), options.fade, soundId);
    }

    return soundId;
  }

  public stop(trackId: string, soundId?: number): void {
    const sound = this.sounds.get(trackId);
    if (sound) {
      if (soundId !== undefined) {
        sound.stop(soundId);
      } else {
        sound.stop();
      }
    }
  }

  public pause(trackId: string, soundId?: number): void {
    const sound = this.sounds.get(trackId);
    if (sound) {
      if (soundId !== undefined) {
        sound.pause(soundId);
      } else {
        sound.pause();
      }
    }
  }

  public setVolume(trackId: string, volume: number, soundId?: number): void {
    const sound = this.sounds.get(trackId);
    if (sound) {
      if (soundId !== undefined) {
        sound.volume(volume, soundId);
      } else {
        sound.volume(volume);
      }
    }
  }

  public setCategoryVolume(category: string, volume: number): void {
    this.categoryVolumes[category] = volume;
    
    // Update all sounds in this category
    this.audioTracks
      .filter(track => track.category === category)
      .forEach(track => {
        const sound = this.sounds.get(track.id);
        if (sound) {
          sound.volume(track.volume * volume);
        }
      });
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = volume;
    Howler.volume(volume);
  }

  public mute(muted: boolean = true): void {
    this.isMuted = muted;
    Howler.mute(muted);
  }

  public fadeOut(trackId: string, duration: number = 1000): void {
    const sound = this.sounds.get(trackId);
    if (sound) {
      sound.fade(sound.volume(), 0, duration);
      setTimeout(() => sound.stop(), duration);
    }
  }

  public fadeIn(trackId: string, targetVolume: number, duration: number = 1000): number | null {
    const sound = this.sounds.get(trackId);
    if (!sound) return null;

    const soundId = sound.play();
    sound.volume(0, soundId);
    sound.fade(0, targetVolume, duration, soundId);
    
    return soundId;
  }

  // Spatial audio methods
  public setPosition(trackId: string, x: number, y: number, z: number, soundId?: number): void {
    const sound = this.sounds.get(trackId);
    if (sound) {
      sound.pos(x, y, z, soundId);
    }
  }

  public setOrientation(x: number, y: number, z: number): void {
    Howler.orientation(x, y, z);
  }

  public setListenerPosition(x: number, y: number, z: number): void {
    Howler.pos(x, y, z);
  }

  // Utility methods
  public isPlaying(trackId: string): boolean {
    const sound = this.sounds.get(trackId);
    return sound ? sound.playing() : false;
  }

  public getDuration(trackId: string): number {
    const sound = this.sounds.get(trackId);
    return sound ? sound.duration() : 0;
  }

  public getState(trackId: string): string {
    const sound = this.sounds.get(trackId);
    return sound ? sound.state() : 'unloaded';
  }
}