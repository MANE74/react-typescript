import { Support } from '../../../apis/authAPI';
import { Tutorial } from '../../../apis/mediaAPI';

export interface SupportLoading {
  internalSupport?: boolean;
  videoTutorial?: boolean;
}

export interface SupportState {
  tutorials: Tutorial[] | null;
  tutorialsImages: string[];
  supports: Support[] | null;
  isLoading: SupportLoading;
  error: string | null;
}
