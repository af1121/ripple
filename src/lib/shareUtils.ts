interface ShareMessageProps {
  username: string;
  challengeTitle: string;
  causeName?: string;
  challengeUrl: string;
}

export function createShareMessage({
  username,
  challengeTitle,
  causeName,
  challengeUrl,
}: ShareMessageProps): string {
  return `${username} has completed ${challengeTitle}${
    causeName ? ` to raise awareness for ${causeName}` : ""
  }. They have nominated you to continue the chain. Click the link below to get started:\n\n${challengeUrl}`;
}

export function shareViaSMS(phoneNumber: string, message: string): void {
  // For iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const smsUrl = isIOS 
    ? `sms:${phoneNumber}&body=${encodeURIComponent(message)}`
    : `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
} 