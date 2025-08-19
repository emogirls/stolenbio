// This component has been replaced by InviteOnlyLanding
// The old MainPage was designed for public access
// stolen.bio is now exclusively invite-only

interface MainPageProps {
  onGetStarted: () => void;
}

export function MainPage({ onGetStarted }: MainPageProps) {
  // Redirect to new invite-only flow
  onGetStarted();
  return null;
}