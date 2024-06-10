const renderATag = (
  toRdender: string,
  type: 'TEL' | 'LINK' | 'EMAIL'
): string => {
  let extra: string = '';
  if (type === 'TEL') extra = 'tel:';
  if (type === 'LINK') {
    extra = toRdender.includes('//') ? '' : '//';
  }
  if (type === 'EMAIL') extra = 'mailto:';
  return `<a className="message-link" href="${extra}${toRdender}" target="_blank" rel="noreferrer noopener">
    ${toRdender}
  </a>`;
};
export const addPhoneAndMailLinks = (text: string): string => {
  const phoneRegex =
    /(s|^)([+]?[(]?[0-9]{2,6}[)]?[- .]?[- /.0-9]{3,15}[^s]\b)/g;
  const protocolUrlTagger =
    /(\s|^)((?:http|https|ftp)\:\/\/([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?::[a-zA-Z0-9]*)?\/?(?:[a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~:])*))/g;
  const wwwUrlTrigger =
    /(\s|^)(www[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?::[a-zA-Z0-9]*)?\/?(?:[a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~:])*)/g;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const splittedText = text.split(' ');

  let phoneToInsert: { phone: string; index: number }[] = [];
  let emailsToInsert: { email: string; index: number }[] = [];
  let linksToInsert: { link: string; index: number }[] = [];

  splittedText.forEach((_text, index) => {
    const isMatch = _text.match(phoneRegex);
    if (isMatch) {
      phoneToInsert.push({ phone: _text, index: index });
    }
    return isMatch;
  });
  splittedText.forEach((_text, index) => {
    const isMatch = _text.match(emailRegex);
    if (isMatch) {
      emailsToInsert.push({ email: _text, index: index });
    }
    return isMatch;
  });
  splittedText.forEach((_text, index) => {
    const isMatch =
      _text.match(wwwUrlTrigger) || _text.match(protocolUrlTagger);
    if (isMatch) {
      linksToInsert.push({ link: _text, index: index });
    }
    return isMatch;
  });

  phoneToInsert.forEach(phone => {
    const link = renderATag(phone.phone, 'TEL');
    splittedText[phone.index] = link;
  });
  emailsToInsert.forEach(email => {
    const link = renderATag(email.email, 'EMAIL');
    splittedText[email.index] = link;
  });
  linksToInsert.forEach(_link => {
    const link = renderATag(_link.link, 'LINK');
    splittedText[_link.index] = link;
  });

  return splittedText.join(' ');
};
