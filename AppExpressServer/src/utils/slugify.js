// utils/slugify.js
import slugify from 'slugify';

export const slugifyText= (text) =>
  text.toLowerCase().replace(/\s+/g, '-');
