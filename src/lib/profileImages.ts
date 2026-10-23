/**
 * Cloudinary Profile Photos Mapping & Resolver
 * Provides hosted Cloudinary profile photos for summit speakers, dignitaries, and attendees.
 */

import { getOptimizedAvatarUrl, optimizeCloudinaryUrl } from './cloudinary';

export const CLOUDINARY_PROFILE_PHOTOS: Record<string, string> = {
  'yatendra-bhargava': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441697/yatendra-bhargava.png',
  'shivakumar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/shivakumar.jpg',
  'swapnil-sapre': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441696/swapnil-sapre.jpg',
  'sudhir-naik': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441696/sudhir-naik.png',
  'sunil-rawat': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441696/sunil-rawat.png',
  'shrihar-pandey': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441696/shrihar-pandey.png',
  'saurabh-sharma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/saurabh-sharma.jpg',
  'seema-verma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/seema-verma.png',
  'satya-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/satya-gupta.png',
  'satish-kumar-modh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/satish-kumar-modh.png',
  'sashi-chandra-sharma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/sashi-chandra-sharma.png',
  'santosh-kumar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/santosh-kumar.png',
  'santanu-talukder': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/santanu-talukder.png',
  'sanjay-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441694/sanjay-gupta.jpg',
  'sankalp-singh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441695/sankalp-singh.png',
  'sanjay-dubey': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441694/sanjay-dubey.png',
  'sangeeta-nakhate': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441694/sangeeta-nakhate.jpg',
  'ravi-sindal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441694/ravi-sindal.png',
  'sajid-khan': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441694/sajid-khan.png',
  'rupesh-dubey': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441694/rupesh-dubey.png',
  'ranveer-singh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441694/ranveer-singh.jpg',
  'ramesh-devani': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441693/ramesh-devani.png',
  'puneet-mittal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441693/puneet-mittal.png',
  'rakesh-singhai': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441693/rakesh-singhai.png',
  'nitesh-purohit': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441692/nitesh-purohit.png',
  'pulkit-dube': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441693/pulkit-dube.png',
  'nitin-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441692/nitin-gupta.png',
  'pratibha-verma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441692/pratibha-verma.png',
  'nitin-dodia': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441692/nitin-dodia.jpg',
  'pramod-kumar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441692/pramod-kumar.jpg',
  'paruchuri-srijith': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441692/paruchuri-srijith.png',
  'mukesh-kumar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/mukesh-kumar.jpg',
  'manish-hooda': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/manish-hooda.png',
  'nishit-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/nishit-gupta.jpg',
  'milind-dandekar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441690/milind-dandekar.png',
  'neha-maheshwari': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/neha-maheshwari.png',
  'neeraj-mandloi': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/neeraj-mandloi.png',
  'namit-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/namit-gupta.png',
  'naredra-dhakad': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/naredra-dhakad.jpg',
  'manu-shrivastava': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441691/manu-shrivastava.png',
  'manas-bajpai': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441690/manas-bajpai.png',
  'lalji': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441690/lalji.png',
  'jawar-singh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441689/jawar-singh.png',
  'madhavendra-shaan-bhatnagar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441690/madhavendra-shaan-bhatnagar.jpg',
  'kamaljeet-singh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441689/kamaljeet-singh.jpg',
  'jyothis-indirabhai': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441690/jyothis-indirabhai.png',
  'krishna-thakur': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441689/krishna-thakur.png',
  'jai-gopal-pandey': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441688/jai-gopal-pandey.png',
  'bithika-gorai': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441689/bithika-gorai.png',
  'jatinder-singh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441689/jatinder-singh.png',
  'jaswinder-ahuja': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441688/jaswinder-ahuja.jpg',
  'dilip-kumar-patnaik': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441688/dilip-kumar-patnaik.png',
  'harshit-tiwari': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441688/harshit-tiwari.png',
  'gaurav-kaushal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441688/gaurav-kaushal.png',
  'harishankar-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441688/harishankar-gupta.png',
  'binit-k-singh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441686/binit-k-singh.png',
  'charan-gurumoorthy': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441687/charan-gurumoorthy.jpg',
  'bhawna-jharia': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441686/bhawna-jharia.png',
  'ashish-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441687/ashish-gupta.png',
  'anima-saxena': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441686/anima-saxena.png',
  'bs-yadav': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441687/bs-yadav.png',
  'avddesh-sharma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441686/avddesh-sharma.jpg',
  'atul-k': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441686/atul-k.png',
  'ashish-lachhwani': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441686/ashish-lachhwani.png',
  'apoorva-raut': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441685/apoorva-raut.png',
  'akhil-bunglowala': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441685/akhil-bunglowala.png',
  'anshuman_raj': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441685/anshuman_raj.jpg',
  'abhishek-saxena': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441684/abhishek-saxena.jpg',
  'abhishek-lal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441684/abhishek-lal.jpg',
  'alpa-sood': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441685/alpa-sood.png',
  'rajeev-dixit': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792441275/rajeev-dixit.jpg',
  'ashok-barnwal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792435975/ashok-barnwal.jpg',
  'dr-mohan-yadav': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792435195/dr-mohan-yadav.jpg',
  'hari-gupta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450462/hari.png',
  'pratosh-bansal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442670/pratosh_bansal.png',
  'rochak-gunavdiya': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442670/rochak_gunavdiya.png',
  'sagar-kature': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442670/sagar_kature.png',
  'vaibhav-neema': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792451701/vaibhav.png',
  'vipul-jaiswal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442671/vipul_jaiswal.png',
  'm-selvendran': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502525/m-selvendran.jpg',
  'mahip-kishore-tejasvi': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502526/mahip-kishore-tejasvi.jpg',
  'avantika-verma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502498/avantika-verma.jpg',
  'avinash-sharma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502497/avinash-sharma.jpg',
  'manoj-sethiya': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502531/manoj-sethiya.jpg',
  'abhishek-pandit': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502570/abhishek-pandit.png',
  'shailendra-raghuwanshi': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502537/shailendra-raghuwanshi.jpg',
  'mayank-nagar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502533/mayank-nagar.png',
  'ashish-tiwari': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502537/ashish-tiwari.png',
  'shivangi-kushwah': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502571/shivangi-kushwah.png',
  'dhwaj-sharma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502513/dhwaj-sharma.jpg',
  'rishi-pandey': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502536/rishi-pandey.png',
  'prof-santosh-kumar-vishvakarma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502537/prof-santosh-kumar-vishvakarma.png',
  'priyanka-gajbhiye': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502535/priyanka-gajbhiye.jpg',
  'jaya-r-koshta': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502517/jaya-r-koshta.png',
  'swati-chauhan': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502538/swati-chauhan.jpg',
  'anshul-puriya': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502487/anshul-puriya.jpg',
  'horil-dev-rajak': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502509/horil-dev-rajak.jpg',
  'akshay-verma': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502511/akshay-verma.png',
  'kishan-kumar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502556/kishan-kumar.png',
  'devendra-gwal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502494/devendra-gwal.jpg',
  'devesh-kumar-basal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792502532/devesh-kumar-basal.png',
  'sarthak-bouddh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442671/sarthak_bouddh.png',
  'akarshan-tyagi': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792442853/akarshan_tyagi.png',
  'alok-kuchlous': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449620/alok-kuchlous.png',
  'swatantra-kumar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449617/swatantra-kumar.png',
  'manish-bali': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449611/manish-bali.png',
  'swapnil-garge': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449610/swapnil-garge.jpg',
  'saurabh-dhingra': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449610/saurabh-dhingra.png',
  'suman-dwivedi': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449608/suman-dwivedi.jpg',
  'sawan-laddha': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449607/sawan-laddha.png',
  'sumedha-limaye': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449607/sumedha-limaye.png',
  'shivender-bhattacharya': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449606/shivender-bhattacharya.jpg',
  'chandramauli-shukla': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449605/chandramauli-shukla.png',
  'mohit-jain': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449605/mohit-jain.png',
  'sanjeev-sehgal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449605/sanjeev-sehgal.jpg',
  'mitesh-kumar-lokwani': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449604/mitesh-kumar-lokwani.png',
  'nitin-kishore': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449604/nitin-kishore.jpg',
  'john-kingsley': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449603/john-kingsley.png',
  'narendra-sen': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449602/narendra-sen.jpg',
  'channakeshav-ananth': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449599/channakeshav-ananth.png',
  'arpan-sircar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449598/arpan-sircar.png',
  'anand-kumar': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792449598/anand-kumar_1.png',
  'yogesh-chauhan': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450451/yogesh-chauhan.jpg',
  'shalu-agarwal': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450450/shalu-agarwal.png',
  'sundeep-saxena': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450449/sundeep-saxena.png',
  'manish-singh': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450448/manish-singh.png',
  'prof-m-m-tripathi': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450448/prof-m-m-tripathi.png',
  'devesh-dwivedi': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450447/devesh-dwivedi.jpg',
  'aparajita-banerjee': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450400/aparajita-banerjee.png',
  'aditi-garg': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450388/aditi-garg.png',
  'amit-rai': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450388/amit-rai.png',
  'alex-p-james': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450388/alex-p-james.png',
  'akshay-k-waghmode': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450388/akshay-k-waghmode.png',
  'aashish-saurikhia': 'https://res.cloudinary.com/vc0wtqtw/image/upload/v1792450387/aashish-saurikhia.png',
};

// Normalized lookup key generator
function normalizeKey(str: string): string {
  if (!str) return '';
  let s = str.toLowerCase().trim();
  // If it's a ui-avatars.com URL, return empty string so it's never treated as a real photo path
  if (s.includes('ui-avatars.com')) {
    return '';
  }
  // Strip url / path
  if (s.includes('/')) {
    s = s.split('/').pop() || s;
  }
  // Strip query parameters
  if (s.includes('?')) {
    s = s.split('?')[0];
  }
  // Strip file extension
  s = s.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  // Strip honorifics & speaker prefixes
  s = s.replace(/^(speaker-|att-|prof\.|dr\.|prof-|dr-|maj\.\s*gen\.|maj-gen-|hon\'?ble\s*|additional-|vice-|chief-)+/gi, '');
  // Strip special characters and whitespace
  s = s.replace(/[^a-z0-9]/g, '');
  return s;
}

// Pre-build normalized fast lookup dictionary
const NORMALIZED_LOOKUP: Record<string, string> = {};

Object.entries(CLOUDINARY_PROFILE_PHOTOS).forEach(([key, url]) => {
  const norm = normalizeKey(key);
  if (norm) {
    NORMALIZED_LOOKUP[norm] = url;
  }
});

// Common name aliases and speaker variations
const ALIASES: Record<string, string> = {
  'narendradhakad': 'naredradhakad',
  'santoshkumarvishvakarma': 'santoshkumar',
  'profsantoshkumarvishvakarma': 'santoshkumar',
  'ranveersinghrathore': 'ranveersingh',
  'ranvirsinghrathore': 'ranveersingh',
  'mohammedsajidkhan': 'sajidkhan',
  'profrajeevdixit': 'rajeevdixit',
  'drpratibhaverma': 'pratibhaverma',
  'drjawarsingh': 'jawarsingh',
  'drshriharpandey': 'shriharpandey',
  'drkamaljeetsingh': 'kamaljeetsingh',
  'drmanishhooda': 'manishhooda',
  'profmukeshkumar': 'mukeshkumar',
  'profrajeshkumar': 'mukeshkumar',
  'profrakeshsinghai': 'rakeshsinghai',
  'drvaibhavneema': 'vaibhav-neema',
  'profvaibhavneema': 'vaibhav-neema',
  'drpratoshbansal': 'pratosh-bansal',
  'rochakgunawadiya': 'rochak-gunavdiya',
  'shivendrabhattacharya': 'shivender-bhattacharya',
  'majgenshivendrabhattacharya': 'shivender-bhattacharya',
  'majgenshivenderbhattacharya': 'shivender-bhattacharya',
  'drmanishbali': 'manish-bali',
};

Object.entries(ALIASES).forEach(([alias, targetKey]) => {
  const normTarget = normalizeKey(targetKey);
  if (NORMALIZED_LOOKUP[normTarget]) {
    NORMALIZED_LOOKUP[alias] = NORMALIZED_LOOKUP[normTarget];
  }
});

/**
 * Resolves Cloudinary profile photo URL by name, id, or legacy image path.
 */
export function getCloudinaryProfileUrl(query?: string | null, size: number = 240): string | undefined {
  if (!query) return undefined;
  
  // If query is or contains a ui-avatars placeholder, return undefined
  if (query.includes('ui-avatars.com')) {
    return undefined;
  }

  // If already a Cloudinary URL, optimize and return
  if (query.includes('res.cloudinary.com')) {
    return getOptimizedAvatarUrl(query, size);
  }

  const clean = normalizeKey(query);
  if (!clean || clean.length < 3) {
    return undefined;
  }

  let matchedUrl: string | undefined = undefined;

  // 1. Direct normalized lookup
  if (NORMALIZED_LOOKUP[clean]) {
    matchedUrl = NORMALIZED_LOOKUP[clean];
  } else if (ALIASES[clean] && NORMALIZED_LOOKUP[normalizeKey(ALIASES[clean])]) {
    // 2. Direct alias lookup
    matchedUrl = NORMALIZED_LOOKUP[normalizeKey(ALIASES[clean])];
  } else {
    // 3. Substring matching for full titles (e.g. query is "Hon'ble Chief Minister Dr. Mohan Yadav")
    // ONLY if clean (the query) includes a full normKey of length >= 8.
    // NEVER do normKey.includes(clean), which mistakenly matches short/partial names to other people!
    for (const [normKey, url] of Object.entries(NORMALIZED_LOOKUP)) {
      if (normKey.length >= 8 && clean.includes(normKey)) {
        matchedUrl = url;
        break;
      }
    }
  }

  return matchedUrl ? getOptimizedAvatarUrl(matchedUrl, size) : undefined;
}

/**
 * Determines whether a person actually has a genuine profile photo
 * (either hosted on Cloudinary or a valid non-placeholder image).
 */
export function hasRealProfilePhoto(
  person: { name?: string; avatar?: string; id?: string } | string | null | undefined
): boolean {
  if (!person) return false;
  let name = '';
  let avatar = '';
  let id = '';

  if (typeof person === 'string') {
    name = person;
    avatar = person;
  } else {
    name = person.name || '';
    avatar = person.avatar || '';
    id = person.id || '';
  }

  const cloudUrl =
    getCloudinaryProfileUrl(name) ||
    getCloudinaryProfileUrl(id) ||
    (avatar && !avatar.includes('ui-avatars.com') ? getCloudinaryProfileUrl(avatar) : undefined);

  if (cloudUrl) return true;

  if (
    avatar &&
    !avatar.includes('ui-avatars.com') &&
    !avatar.startsWith('/images/speakers/default') &&
    !avatar.startsWith('/images/avatars/default') &&
    avatar !== '/images/avatars/santosh-kumar.png' &&
    avatar !== '/images/avatars/hari-gupta.jpg' &&
    avatar !== '/images/avatars/hari-gupta.png' &&
    avatar !== '/images/mentors/pratosh-bansal.jpg' &&
    avatar !== '/images/mentors/vaibhav-neema.jpg' &&
    !avatar.startsWith('/images/founders/hari-gupta')
  ) {
    return true;
  }

  return false;
}

/**
 * Returns the best available avatar for an attendee/speaker, prioritizing Cloudinary
 * and falling back gracefully to UI-avatars or existing image.
 */
export function getProfileAvatar(
  person: { name?: string; avatar?: string; id?: string } | string | null | undefined,
  fallbackName?: string
): string {
  if (!person) {
    const name = fallbackName || 'Guest';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=181818&color=ffffff&bold=true`;
  }

  let name = '';
  let avatar = '';
  let id = '';

  if (typeof person === 'string') {
    name = person;
    avatar = person;
  } else {
    name = person.name || fallbackName || '';
    avatar = person.avatar || '';
    id = person.id || '';
  }

  // If avatar is already a local Base64 Data URL, return directly
  if (avatar && avatar.startsWith('data:')) {
    return avatar;
  }

  // 1. Try Cloudinary match by person name, id, or avatar path
  const cloudUrl =
    getCloudinaryProfileUrl(name) ||
    getCloudinaryProfileUrl(id) ||
    (avatar && !avatar.includes('ui-avatars.com') ? getCloudinaryProfileUrl(avatar) : undefined);

  if (cloudUrl) {
    return cloudUrl;
  }

  // 2. If avatar is a real photo URL (hosted or external, but NOT ui-avatars.com placeholder)
  if (
    avatar &&
    !avatar.includes('ui-avatars.com') &&
    !avatar.startsWith('/images/speakers/default') &&
    !avatar.startsWith('/images/avatars/default') &&
    avatar !== '/images/avatars/santosh-kumar.png' &&
    avatar !== '/images/avatars/hari-gupta.jpg' &&
    avatar !== '/images/avatars/hari-gupta.png' &&
    avatar !== '/images/mentors/pratosh-bansal.jpg' &&
    avatar !== '/images/mentors/vaibhav-neema.jpg' &&
    !avatar.startsWith('/images/founders/hari-gupta')
  ) {
    return optimizeCloudinaryUrl(avatar, { width: 240, height: 240, crop: 'fill', gravity: 'face' });
  }

  // 3. Fallback to clean initials avatar
  const displayName = name || fallbackName || 'Guest';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=181818&color=ffffff&bold=true`;
}
