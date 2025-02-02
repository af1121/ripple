interface ShareMessageProps {
  username: string;
  challengeTitle: string;
  charityName?: string;
  challengeUrl: string;
}

export function createShareMessage({
  username,
  challengeTitle,
  charityName,
  challengeUrl,
}: ShareMessageProps): string {
  return `${username} has completed ${challengeTitle}${
    charityName ? ` to raise awareness for ${charityName}` : ""
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