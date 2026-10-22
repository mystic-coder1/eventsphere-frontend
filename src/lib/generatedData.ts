import { Person, ExhibitorStats, Product } from '../types';

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Kabir', 'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Anika', 'Navya', 'Avni', 'Diya', 'Shruti', 'Neha', 'Rohan', 'Vikram', 'Priya', 'Kavya', 'Siddharth', 'Amit', 'Sunita', 'Rajesh', 'Pooja', 'Deepak', 'Sneha', 'Rahul', 'Nisha', 'Ravi', 'Ritu', 'Akash', 'Kiran', 'Tarun', 'Manoj', 'Prakash', 'Gaurav', 'Vinay', 'Ashok', 'Sanjay', 'Geeta', 'Sita', 'Anita', 'Sunil', 'Anil', 'Naveen', 'Vijay', 'Vikas', 'Ajay'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Bansal', 'Agarwal', 'Singh', 'Kumar', 'Das', 'Bose', 'Chatterjee', 'Sengupta', 'Patil', 'Deshmukh', 'Joshi', 'Kulkarni', 'Reddy', 'Rao', 'Naidu', 'Chowdary', 'Menon', 'Nair', 'Pillai', 'Iyer', 'Iyengar', 'Natarajan', 'Gowda', 'Hegde', 'Shenoy', 'Prabhu', 'Mehta', 'Shah', 'Patel', 'Desai', 'Parekh', 'Gandhi', 'Chauhan', 'Rajput', 'Yadav', 'Ahir', 'Bhatt', 'Trivedi', 'Vyas', 'Mukherjee', 'Banerjee', 'Ganguly', 'Kaur', 'Gill', 'Dhillon', 'Sandhu'];

const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Accenture', 'IBM', 'Capgemini', 'Oracle', 'Microsoft', 'Google', 'Amazon', 'Flipkart', 'Zoho', 'Freshworks', 'Paytm', 'Zomato', 'Swiggy', 'Ola', 'Uber', 'Intel', 'AMD', 'NVIDIA', 'Qualcomm', 'Cisco', 'Juniper', 'VMware', 'Red Hat', 'SAP', 'Salesforce', 'Adobe', 'Intuit', 'Atlassian', 'ThoughtWorks', 'Mindtree', 'L&T Infotech', 'Mphasis', 'Hexaware', 'Cyient', 'Tata Elxsi', 'KPIT', 'Zensar', 'Persistent', 'Coforge', 'Birlasoft', 'Sonata', 'Mastek', 'Datamatics', 'Ramco'];

const designations = ['Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager', 'Director of Engineering', 'VP of Engineering', 'CTO', 'Product Manager', 'Senior Product Manager', 'Group Product Manager', 'Director of Product', 'VP of Product', 'CPO', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'AI/ML Engineer', 'Data Engineer', 'Cloud Architect', 'Solutions Architect', 'DevOps Engineer', 'SRE', 'Security Engineer', 'UX Designer', 'UI Designer', 'Product Designer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer'];

const interestsList = ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Data Science', 'Web Development', 'Mobile Development', 'DevOps', 'Cybersecurity', 'Blockchain', 'IoT', 'AR/VR', 'Quantum Computing', 'SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'Enterprise Software', 'Open Source', 'UI/UX Design', 'Product Management', 'Agile Methodologies', 'Startup Ecosystem', 'Venture Capital', 'Angel Investing'];

// Use a simple seeded PRNG so it's consistent across hot reloads
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
const rng = mulberry32(42);

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateAttendees(count: number): Person[] {
  const attendees: Person[] = [];
  for (let i = 0; i < count; i++) {
    const fn = randomElement(firstNames);
    const ln = randomElement(lastNames);
    const name = `${fn} ${ln}`;
    const company = randomElement(companies);
    const designation = randomElement(designations);
    const score = (i < 20) ? Math.floor(rng() * 20) + 80 : Math.floor(rng() * 100);
    const numInterests = Math.floor(rng() * 3) + 2;
    const interests: string[] = [];
    for (let j = 0; j < numInterests; j++) {
      const interest = randomElement(interestsList);
      if (!interests.includes(interest)) {
        interests.push(interest);
      }
    }
    
    attendees.push({
      id: `gen-att-${i}`,
      name: name,
      designation: designation,
      company: company,
      avatar: `https://i.pravatar.cc/150?u=${fn}+${ln}`,
      interests: interests,
      relevanceScore: score,
      bio: `Professional at ${company} focusing on ${interests[0] || 'technology'}.`,
      skills: interests,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      mobile: '+91 98765 43210',
      linkedin: `linkedin.com/in/${fn.toLowerCase()}${ln.toLowerCase()}`,
      privacy: {
        shareEmail: true,
        sharePhone: false,
        shareLinkedIn: true,
        preset: 'Connections Only'
      },
      checkedIn: i < 1115,
      registrationId: `#${String(1000 + i).padStart(4, '0')}`,
      ticketType: (i % 12 === 0 ? 'VIP' : i % 8 === 0 ? 'Exhibitor' : 'Delegate'),
      role: (i % 12 === 0 ? 'vip' : i % 8 === 0 ? 'exhibitor_staff' : 'delegate'),
    });
  }
  return attendees;
}

export const GENERATED_EXHIBITORS: ExhibitorStats[] = [

  {
    "id": "exh-1",
    "company": "DigiComm Semi",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696119/18-digicomm-semi.jpg",
    "booth": "1, 2",
    "category": "Semiconductor Design",
    "visits": 620,
    "leads": 215,
    "enquiries": 98,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-2",
    "company": "New Age Instruments",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696170/29-new-age-instruments-and-material-s-pvt-ltd.jpg",
    "booth": "3, 4, 5",
    "category": "Instrumentation & Test",
    "visits": 540,
    "leads": 180,
    "enquiries": 76,
    "teamSize": 6,
    "status": "Active"
  },
  {
    "id": "exh-3",
    "company": "RRCAT",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696166/28-rrcat.jpg",
    "booth": "6, 7",
    "category": "R&D & Computing",
    "visits": 710,
    "leads": 240,
    "enquiries": 110,
    "teamSize": 12,
    "status": "Active"
  },
  {
    "id": "exh-4",
    "company": "Bio Line India",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696156/26-bio-line-india.jpg",
    "booth": "8",
    "category": "Instrumentation & Test",
    "visits": 420,
    "leads": 130,
    "enquiries": 58,
    "teamSize": 5,
    "status": "Active"
  },
  {
    "id": "exh-5",
    "company": "AndGate Informatics",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696063/06-andgate-informatics.jpg",
    "booth": "9",
    "category": "Embedded Systems",
    "visits": 430,
    "leads": 145,
    "enquiries": 62,
    "teamSize": 6,
    "status": "Active"
  },
  {
    "id": "exh-6",
    "company": "VLSI Experts",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696101/14-vlsi-experts.jpg",
    "booth": "10",
    "category": "Skill Development",
    "visits": 680,
    "leads": 260,
    "enquiries": 135,
    "teamSize": 9,
    "status": "Active"
  },
  {
    "id": "exh-7",
    "company": "RackBank",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696082/10-rackbank-datacenters-pvt-ltd.jpg",
    "booth": "11, 12",
    "category": "AI Data Centers",
    "visits": 810,
    "leads": 310,
    "enquiries": 145,
    "teamSize": 10,
    "status": "Active"
  },
  {
    "id": "exh-8",
    "company": "Impute Inc. Japan",
    "logo": "",
    "booth": "13, 14",
    "category": "AI & Edge Systems",
    "visits": 690,
    "leads": 240,
    "enquiries": 115,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-9",
    "company": "Analog Devices",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696265/46-analog-devices.jpg",
    "booth": "15, 16",
    "category": "Semiconductor Design",
    "visits": 950,
    "leads": 380,
    "enquiries": 190,
    "teamSize": 14,
    "status": "Active"
  },
  {
    "id": "exh-10",
    "company": "Nanodroits Technology",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696072/08-nanodroits-technology.jpg",
    "booth": "17",
    "category": "Nanotechnology",
    "visits": 460,
    "leads": 155,
    "enquiries": 70,
    "teamSize": 6,
    "status": "Active"
  },
  {
    "id": "exh-11",
    "company": "MANIT Bhopal",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696128/20-manit-bhopal.jpg",
    "booth": "18",
    "category": "Academia & Research",
    "visits": 590,
    "leads": 190,
    "enquiries": 85,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-12",
    "company": "HLBS Technologies",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696087/11-hlbs.jpg",
    "booth": "19",
    "category": "Electronics Manufacturing",
    "visits": 480,
    "leads": 160,
    "enquiries": 72,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-13",
    "company": "Jetwave",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696147/24-jetwave.jpg",
    "booth": "20",
    "category": "RF & Wireless Systems",
    "visits": 410,
    "leads": 135,
    "enquiries": 60,
    "teamSize": 5,
    "status": "Active"
  },
  {
    "id": "exh-14",
    "company": "ABV-IIITM Gwalior",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696142/23-abv-iiitm-gwalior.jpg",
    "booth": "21",
    "category": "Academia & Research",
    "visits": 530,
    "leads": 175,
    "enquiries": 78,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-15",
    "company": "AgriHub IIT Indore",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696236/39-iiti-drishti-cps-foundation.jpg",
    "booth": "22",
    "category": "IoT & Sensors",
    "visits": 470,
    "leads": 150,
    "enquiries": 65,
    "teamSize": 6,
    "status": "Active"
  },
  {
    "id": "exh-16",
    "company": "Daksh Instruments",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696250/43-daksh-instruments-pvt-ltd.jpg",
    "booth": "23",
    "category": "Instrumentation & Test",
    "visits": 390,
    "leads": 125,
    "enquiries": 52,
    "teamSize": 5,
    "status": "Active"
  },
  {
    "id": "exh-17",
    "company": "DAVV Incubation Center",
    "logo": "",
    "booth": "24",
    "category": "Incubation & Startups",
    "visits": 510,
    "leads": 170,
    "enquiries": 80,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-18",
    "company": "IET-DAVV Indore",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696255/44-iet-davv-indore.jpg",
    "booth": "25",
    "category": "Academia & Research",
    "visits": 620,
    "leads": 210,
    "enquiries": 95,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-19",
    "company": "Setu Manufacturing",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696184/32-setu-manufacturing-solutions.jpg",
    "booth": "26",
    "category": "Electronics Manufacturing",
    "visits": 490,
    "leads": 165,
    "enquiries": 74,
    "teamSize": 6,
    "status": "Active"
  },
  {
    "id": "exh-20",
    "company": "Nirji Semicon",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696274/nirji-semicon.jpg",
    "booth": "27",
    "category": "Semiconductor Design",
    "visits": 540,
    "leads": 185,
    "enquiries": 82,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-21",
    "company": "Stemrobo",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696053/04-stemrobo.jpg",
    "booth": "28",
    "category": "EdTech & Robotics",
    "visits": 620,
    "leads": 210,
    "enquiries": 95,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-22",
    "company": "IISER Bhopal / Anuranan",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696270/iiser-bhopal.png",
    "booth": "29",
    "category": "Academia & Research",
    "visits": 560,
    "leads": 190,
    "enquiries": 84,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-23",
    "company": "Techno Support Core Inn",
    "logo": "",
    "booth": "30",
    "category": "Prototyping & Lab Support",
    "visits": 420,
    "leads": 135,
    "enquiries": 59,
    "teamSize": 5,
    "status": "Active"
  },
  {
    "id": "exh-24",
    "company": "VIT Bhopal",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696124/19-vit-bhopal.jpg",
    "booth": "31",
    "category": "Academia & Research",
    "visits": 640,
    "leads": 220,
    "enquiries": 99,
    "teamSize": 9,
    "status": "Active"
  },
  {
    "id": "exh-25",
    "company": "SGSTS Indore",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696138/22-sgsits-indore.jpg",
    "booth": "32",
    "category": "Academia & Research",
    "visits": 670,
    "leads": 235,
    "enquiries": 105,
    "teamSize": 10,
    "status": "Active"
  },
  {
    "id": "exh-26",
    "company": "Samvit Logix",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696246/42-leadsoc-technologies.jpg",
    "booth": "33",
    "category": "ASIC & Verification",
    "visits": 450,
    "leads": 150,
    "enquiries": 66,
    "teamSize": 6,
    "status": "Active"
  },
  {
    "id": "exh-27",
    "company": "Medicaps",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696133/21-medicaps.jpg",
    "booth": "34",
    "category": "Academia & Research",
    "visits": 580,
    "leads": 195,
    "enquiries": 86,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-28",
    "company": "Lakshmishri PCB",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696197/35-laxmishri-printed-circuit-boad.jpg",
    "booth": "35",
    "category": "PCB Design & Fabrication",
    "visits": 530,
    "leads": 180,
    "enquiries": 80,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-29",
    "company": "Mehtab Intl Agro Trade",
    "logo": "",
    "booth": "36",
    "category": "AgriTech & Automation",
    "visits": 380,
    "leads": 120,
    "enquiries": 50,
    "teamSize": 5,
    "status": "Active"
  },
  {
    "id": "exh-30",
    "company": "Prestige PIEMR / Soaring",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696279/prestige-piemr.svg",
    "booth": "37",
    "category": "Academia & Research",
    "visits": 610,
    "leads": 205,
    "enquiries": 90,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-31",
    "company": "Acropolis Institute",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696174/30-acropolis-institute-of-tecnology-and-resea.jpg",
    "booth": "38",
    "category": "Academia & Research",
    "visits": 630,
    "leads": 215,
    "enquiries": 94,
    "teamSize": 9,
    "status": "Active"
  },
  {
    "id": "exh-32",
    "company": "SAGUNE University",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696210/36-sage-university-indore.jpg",
    "booth": "39",
    "category": "Academia & Research",
    "visits": 590,
    "leads": 200,
    "enquiries": 88,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-33",
    "company": "IES University",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696260/45-iet-university-bhopal.jpg",
    "booth": "40",
    "category": "Academia & Research",
    "visits": 510,
    "leads": 170,
    "enquiries": 75,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-34",
    "company": "Technisium Web Solutions",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696284/technisum.png",
    "booth": "41",
    "category": "Cloud & Web Integration",
    "visits": 440,
    "leads": 140,
    "enquiries": 62,
    "teamSize": 6,
    "status": "Active"
  },
  {
    "id": "exh-35",
    "company": "Oriental University",
    "logo": "",
    "booth": "42",
    "category": "Academia & Research",
    "visits": 520,
    "leads": 175,
    "enquiries": 78,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-36",
    "company": "HTL Co India",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696188/33-htl-co-india-pvt-ltd.jpg",
    "booth": "43, 44",
    "category": "Instrumentation & Fab Support",
    "visits": 570,
    "leads": 195,
    "enquiries": 85,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-37",
    "company": "Scientech",
    "logo": "",
    "booth": "45, 46",
    "category": "Instrumentation & Test",
    "visits": 720,
    "leads": 255,
    "enquiries": 115,
    "teamSize": 9,
    "status": "Active"
  },
  {
    "id": "exh-38",
    "company": "SVVV Indore",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696096/13-svvv-indore.jpg",
    "booth": "47",
    "category": "Academia & Research",
    "visits": 580,
    "leads": 195,
    "enquiries": 85,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-39",
    "company": "Futurewiz",
    "logo": "",
    "booth": "48",
    "category": "Skill Development & EDA",
    "visits": 560,
    "leads": 190,
    "enquiries": 82,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-40",
    "company": "Truechip Solutions",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "booth": "49",
    "category": "Verification IP & EDA",
    "visits": 760,
    "leads": 290,
    "enquiries": 140,
    "teamSize": 14,
    "status": "Active"
  },
  {
    "id": "exh-41",
    "company": "MSME",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507137/MSME-logo.png",
    "booth": "50, 51",
    "category": "Government & Nodal",
    "visits": 680,
    "leads": 230,
    "enquiries": 110,
    "teamSize": 10,
    "status": "Active"
  },
  {
    "id": "exh-42",
    "company": "MPCST",
    "logo": "",
    "booth": "52, 53",
    "category": "Government & Nodal",
    "visits": 650,
    "leads": 220,
    "enquiries": 105,
    "teamSize": 10,
    "status": "Active"
  },
  {
    "id": "exh-43",
    "company": "Technical Education",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696152/25-nielit.jpg",
    "booth": "54",
    "category": "Government & Nodal",
    "visits": 610,
    "leads": 205,
    "enquiries": 95,
    "teamSize": 9,
    "status": "Active"
  },
  {
    "id": "exh-44",
    "company": "Higher Education",
    "logo": "",
    "booth": "55",
    "category": "Government & Nodal",
    "visits": 590,
    "leads": 200,
    "enquiries": 90,
    "teamSize": 9,
    "status": "Active"
  },
  {
    "id": "exh-45",
    "company": "Teradyne",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696229/38-teradyne.jpg",
    "booth": "56",
    "category": "Automated Test Equipment",
    "visits": 840,
    "leads": 330,
    "enquiries": 160,
    "teamSize": 12,
    "status": "Active"
  },
  {
    "id": "exh-46",
    "company": "Pisarv Innovations",
    "logo": "",
    "booth": "57",
    "category": "IoT, Cloud & Robotics",
    "visits": 580,
    "leads": 190,
    "enquiries": 85,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-47",
    "company": "Tourism",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507116/mp-tourism-logo.jpg",
    "booth": "58, 70",
    "category": "Government & Nodal",
    "visits": 670,
    "leads": 210,
    "enquiries": 95,
    "teamSize": 10,
    "status": "Active"
  },
  {
    "id": "exh-48",
    "company": "Indiesemic",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696192/34-indiesemic-private-limited.jpg",
    "booth": "59",
    "category": "Semiconductor Design",
    "visits": 560,
    "leads": 195,
    "enquiries": 88,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-49",
    "company": "Shubham IOT Homes",
    "logo": "",
    "booth": "60, 61",
    "category": "IoT & Smart Devices",
    "visits": 520,
    "leads": 175,
    "enquiries": 78,
    "teamSize": 7,
    "status": "Active"
  },
  {
    "id": "exh-50",
    "company": "CraftAI",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696161/27-craftifai.jpg",
    "booth": "62",
    "category": "AI & Silicon Acceleration",
    "visits": 610,
    "leads": 210,
    "enquiries": 95,
    "teamSize": 8,
    "status": "Active"
  },
  {
    "id": "exh-51",
    "company": "CSIR CEERI Pilani",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696214/37-csir-ceeri-pilani.jpg",
    "booth": "63",
    "category": "Academia & Research",
    "visits": 690,
    "leads": 245,
    "enquiries": 110,
    "teamSize": 10,
    "status": "Active"
  },
  {
    "id": "exh-52",
    "company": "MCTE Mhow",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696077/09-mcte.jpg",
    "booth": "64, 65",
    "category": "Defense & Strategic Comms",
    "visits": 730,
    "leads": 260,
    "enquiries": 120,
    "teamSize": 11,
    "status": "Active"
  },
  {
    "id": "exh-53",
    "company": "Paras Semi",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696115/17-paras-semi.jpg",
    "booth": "66, 67",
    "category": "OSAT & Packaging",
    "visits": 780,
    "leads": 280,
    "enquiries": 130,
    "teamSize": 12,
    "status": "Active"
  },
  {
    "id": "exh-54",
    "company": "NSDCS Lab, IIT Indore",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696241/41-nsdcs-lab-iit-indore.jpg",
    "booth": "68, 69",
    "category": "Academia & Research",
    "visits": 650,
    "leads": 230,
    "enquiries": 105,
    "teamSize": 9,
    "status": "Active"
  },
  {
    "id": "exh-55",
    "company": "MPIDC",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792507118/mpinvestmetnlogo.jpg",
    "booth": "MPIDC Pavilion",
    "category": "Industrial Infrastructure",
    "visits": 890,
    "leads": 310,
    "enquiries": 155,
    "teamSize": 14,
    "status": "Active"
  },
  {
    "id": "exh-56",
    "company": "SCL Mohali",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696068/07-scl-mohali.jpg",
    "booth": "SCL Mohali Pavilion",
    "category": "Wafer Fabrication",
    "visits": 920,
    "leads": 330,
    "enquiries": 170,
    "teamSize": 15,
    "status": "Active"
  },
  {
    "id": "exh-57",
    "company": "MPSEDC",
    "logo": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696040/01-mpsedc.jpg",
    "booth": "MPSEDC Pavilion",
    "category": "State Nodal Agency",
    "visits": 980,
    "leads": 340,
    "enquiries": 185,
    "teamSize": 16,
    "status": "Active"
  }

];

export const GENERATED_PRODUCTS: Product[] = [
  {
    "id": "prod-mpsedc-1",
    "name": "MP Semiconductor & Fab Policy Incentives",
    "tagline": "State Policy Support for Semiconductor Units",
    "company": "MPSEDC",
    "category": "State Policy & Grants",
    "booth": "MPSEDC Pavilion",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696040/01-mpsedc.jpg",
    "views": 890,
    "enquiries": 68,
    "interestedVisitorsCount": 142,
    "overview": "State-level capital subsidy, subsidized land, dedicated power, and stamp duty exemptions for chip design, OSAT, and fab units in MP.",
    "features": [
      "Capital Subsidy up to 50%",
      "Plug-and-play Incubation at Indore",
      "Single-window Approvals"
    ],
    "benefits": [
      "Faster Time to Market",
      "Significant CAPEX reduction",
      "State-backed infrastructure"
    ],
    "useCases": [
      "Semiconductor Startups",
      "OSAT Facilities",
      "Fabless Design Houses"
    ],
    "resources": {
      "websiteUrl": "https://mpsedc.mp.gov.in"
    }
  },
  {
    "id": "prod-mpsedc-2",
    "name": "Indore ESDM Innovation & Testing Facility",
    "tagline": "Shared Testing & Characterization Labs",
    "company": "MPSEDC",
    "category": "Infrastructure",
    "booth": "MPSEDC Pavilion",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696040/01-mpsedc.jpg",
    "views": 710,
    "enquiries": 45,
    "interestedVisitorsCount": 98,
    "overview": "World-class shared testing, EMC/EMI validation, and prototyping infrastructure for semiconductor and electronic manufacturers.",
    "features": [
      "Shared Cleanroom Facilities",
      "Advanced Measurement Instruments",
      "Technical Mentorship"
    ],
    "benefits": [
      "Lower barrier to prototype",
      "Certified compliance",
      "Local ecosystem access"
    ],
    "useCases": [
      "MSMEs",
      "University Spin-offs",
      "Electronic Manufacturers"
    ],
    "resources": {
      "websiteUrl": "https://mpsedc.mp.gov.in"
    }
  },
  {
    "id": "prod-truechip-1",
    "name": "PCIe Gen 6 / Gen 7 Verification IP",
    "tagline": "Next-Gen PCI Express Verification Suite",
    "company": "Truechip Solutions",
    "category": "Verification IP & EDA",
    "booth": "49",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "views": 840,
    "enquiries": 65,
    "interestedVisitorsCount": 138,
    "overview": "Industry-standard Verification IP for PCI Express Gen 6 and Gen 7 with full PAM4 signaling, FLIT mode, SRIS, and compliance checkers.",
    "features": [
      "PAM4 Signaling & 64/128 GT/s FLIT Mode",
      "SystemVerilog / UVM Native Architecture",
      "Advanced Error Injection & Protocol Assertions"
    ],
    "benefits": [
      "Drastically cuts verification cycle times",
      "Zero protocol ambiguity with full compliance",
      "Proven across 100+ silicon tapeouts"
    ],
    "useCases": [
      "High Performance Compute (HPC)",
      "AI/ML Accelerators",
      "Data Center & Cloud SoCs"
    ],
    "resources": {
      "websiteUrl": "https://www.truechip.net/product/verification-ip"
    }
  },
  {
    "id": "prod-truechip-2",
    "name": "UCIe (Universal Chiplet Interconnect) VIP",
    "tagline": "Turnkey Die-to-Die Chiplet Verification",
    "company": "Truechip Solutions",
    "category": "Verification IP & EDA",
    "booth": "49",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "views": 790,
    "enquiries": 58,
    "interestedVisitorsCount": 124,
    "overview": "Comprehensive Die-to-Die (D2D) chiplet verification supporting standard and advanced package architectures, D2D adapter, and physical layers.",
    "features": [
      "UCIe 1.0 & 1.1 Multi-die Interconnect Support",
      "D2D Adapter & Protocol Layer Verification",
      "Sideband & Mainband Channel Modeling"
    ],
    "benefits": [
      "Ensures inter-chiplet interoperability",
      "Rapid integration in standard UVM testbenches",
      "Reduces physical prototyping risks"
    ],
    "useCases": [
      "Heterogeneous AI Chiplets",
      "Modular Server Processors",
      "Multi-Die Automotive SoCs"
    ],
    "resources": {
      "websiteUrl": "https://www.truechip.net/product/verification-ip"
    }
  },
  {
    "id": "prod-truechip-3",
    "name": "CXL 3.1 / 3.0 (Compute Express Link) VIP",
    "tagline": "High-Bandwidth Coherent Interconnect Verification",
    "company": "Truechip Solutions",
    "category": "Verification IP & EDA",
    "booth": "49",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "views": 720,
    "enquiries": 49,
    "interestedVisitorsCount": 112,
    "overview": "Complete Verification IP for CXL.io, CXL.cache, and CXL.mem protocols, enabling verification of memory expansion, accelerators, and pooled memory.",
    "features": [
      "CXL.io, CXL.cache, and CXL.mem Support",
      "Coherent Memory Fabric Verification",
      "Multi-Logical Device (MLD) Modeling"
    ],
    "benefits": [
      "Guarantees cache coherency validation",
      "Shortens verification schedule for complex memory architectures",
      "Built-in compliance checking test suites"
    ],
    "useCases": [
      "Disaggregated Cloud Memory",
      "Accelerated Computing Clusters",
      "Enterprise Storage Systems"
    ],
    "resources": {
      "websiteUrl": "https://www.truechip.net/product/verification-ip"
    }
  },
  {
    "id": "prod-truechip-4",
    "name": "USB4 & USB-PD 3.1 Verification IP",
    "tagline": "High-Speed Multi-Protocol Tunneling Verification",
    "company": "Truechip Solutions",
    "category": "Verification IP & EDA",
    "booth": "49",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "views": 680,
    "enquiries": 44,
    "interestedVisitorsCount": 98,
    "overview": "Complete USB4 router, adapter layer, and Type-C Power Delivery 3.1 verification IP supporting up to 80 Gbps tunneling of PCIe and DisplayPort.",
    "features": [
      "USB4 v2.0 / Gen 4 80 Gbps PAM3 Support",
      "Full USB Type-C and Power Delivery 3.1",
      "Simultaneous PCIe & DisplayPort Tunneling"
    ],
    "benefits": [
      "Exhaustive test suite for corner cases",
      "Plug-and-play SystemVerilog UVM environment",
      "Field-tested compliance test sequences"
    ],
    "useCases": [
      "Consumer Electronics SoCs",
      "Smartphones & Laptops",
      "Automotive Infotainment Hubs"
    ],
    "resources": {
      "websiteUrl": "https://www.truechip.net/product/verification-ip"
    }
  },
  {
    "id": "prod-truechip-5",
    "name": "HBM3 / LPDDR5X Memory VIP",
    "tagline": "High-Bandwidth Memory Protocol Verification",
    "company": "Truechip Solutions",
    "category": "Verification IP & EDA",
    "booth": "49",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "views": 650,
    "enquiries": 42,
    "interestedVisitorsCount": 92,
    "overview": "Turnkey memory verification IP for next-generation AI and mobile memory subsystems, verifying physical and link layers seamlessly.",
    "features": [
      "Multi-die HBM3 & LPDDR5X Support",
      "Real-time Timing Assertions & JEDEC Checks",
      "Dynamic Frequency Scaling Verification"
    ],
    "benefits": [
      "First-pass silicon success",
      "Fast debugging with visual wave tracking",
      "Multi-simulator vendor support"
    ],
    "useCases": [
      "Edge AI Chips",
      "Mobile 5G Processors",
      "Graphics & Neural Processing Units"
    ],
    "resources": {
      "websiteUrl": "https://www.truechip.net/product/verification-ip"
    }
  },
  {
    "id": "prod-truechip-6",
    "name": "RISC-V Verification Suite & TileLink VIP",
    "tagline": "Comprehensive Open-Architecture Core Verification",
    "company": "Truechip Solutions",
    "category": "Verification IP & EDA",
    "booth": "49",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "views": 610,
    "enquiries": 38,
    "interestedVisitorsCount": 85,
    "overview": "End-to-end RISC-V processor testbenches covering TileLink cache coherency, JTAG DTM, PLIC/CLINT interrupt controllers, and custom ISA extensions.",
    "features": [
      "TileLink TL-UL, TL-UH, and TL-C Support",
      "Custom Instruction & Extension Checkers",
      "Automated Test Generator for Core Pipelines"
    ],
    "benefits": [
      "Accelerates indigenous silicon design cycles",
      "Validates full processor coherency",
      "Seamless integration with open-source tools"
    ],
    "useCases": [
      "Indigenous Indian Microprocessors",
      "IoT & Edge Controllers",
      "Custom AI Silicon"
    ],
    "resources": {
      "websiteUrl": "https://www.truechip.net/product/verification-ip"
    }
  },
  {
    "id": "prod-truechip-7",
    "name": "TruEye GUI Protocol Debug & Automation",
    "tagline": "Intelligent Visual Protocol Analyzer & Debugger",
    "company": "Truechip Solutions",
    "category": "Verification IP & EDA",
    "booth": "49",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696048/03-truesilicon.jpg",
    "views": 590,
    "enquiries": 36,
    "interestedVisitorsCount": 78,
    "overview": "Proprietary GUI-based protocol debug environment providing transaction-level visualization, performance analytics, and automated packet tracing.",
    "features": [
      "Transaction-Level Waveform & Packet Viewer",
      "Real-time Bandwidth & Latency Analytics",
      "Automated Protocol Bug Diagnosis"
    ],
    "benefits": [
      "Reduces debug cycles by up to 60%",
      "Intuitive graphical trace timeline",
      "Cross-platform support for major EDA tools"
    ],
    "useCases": [
      "SoC Verification Engineers",
      "Firmware Development Teams",
      "Post-Silicon Validation"
    ],
    "resources": {
      "websiteUrl": "https://www.truechip.net/automation-products.php"
    }
  },
  {
    "id": "prod-cdac-1",
    "name": "VEGA RISC-V Microprocessor Ecosystem",
    "tagline": "Indigenous Open-Architecture Processors",
    "company": "RRCAT",
    "category": "R&D & Computing",
    "booth": "6, 7",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696166/28-rrcat.jpg",
    "views": 820,
    "enquiries": 74,
    "interestedVisitorsCount": 165,
    "overview": "India's indigenous 32-bit and 64-bit RISC-V processor family designed by C-DAC under the Microprocessor Development Programme (MDP).",
    "features": [
      "Single & Dual Core Variants",
      "Linux & RTOS Support",
      "Integrated Security Blocks"
    ],
    "benefits": [
      "Sovereign silicon trust",
      "No proprietary architecture royalties",
      "Ideal for strategic electronics"
    ],
    "useCases": [
      "Smart Energy Meters",
      "Industrial Automation",
      "Strategic Systems"
    ],
    "resources": {
      "websiteUrl": "https://cdac.in"
    }
  },
  {
    "id": "prod-scl-1",
    "name": "180nm CMOS Foundry Fabrication",
    "tagline": "Sovereign Silicon Wafer Fab Services",
    "company": "SCL Mohali",
    "category": "Semiconductor Fabrication",
    "booth": "SCL Mohali Pavilion",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696068/07-scl-mohali.jpg",
    "views": 930,
    "enquiries": 88,
    "interestedVisitorsCount": 190,
    "overview": "Full turnkey 180nm CMOS and MEMS wafer fabrication services for strategic, aerospace, and commercial multi-project wafer (MPW) runs.",
    "features": [
      "8-inch Wafer Capability",
      "Radiation-Hardened Library",
      "In-house Testing & Packaging"
    ],
    "benefits": [
      "Domestic fabrication",
      "Space and defense qualified",
      "Regular MPW shuttle runs"
    ],
    "useCases": [
      "ISRO Satellite Payloads",
      "Defense Microelectronics",
      "Academic MPW Shuttles"
    ],
    "resources": {
      "websiteUrl": "https://scl.gov.in"
    }
  },
  {
    "id": "prod-analog-1",
    "name": "AD9361 High-Performance RF Agile Transceiver",
    "tagline": "Complete SDR Transceiver 70 MHz to 6.0 GHz",
    "company": "Analog Devices",
    "category": "Analog & Mixed-Signal ICs",
    "booth": "15-16",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696265/46-analog-devices.jpg",
    "views": 940,
    "enquiries": 92,
    "interestedVisitorsCount": 180,
    "overview": "Highly integrated radio frequency (RF) transceiver capable of wideband communications, point-to-point communication systems, and defense electronics.",
    "features": [
      "Dual 12-bit DACs and ADCs",
      "Tunable RF bandwidth 200 kHz to 56 MHz",
      "FDD and TDD Operation"
    ],
    "benefits": [
      "Compact footprint",
      "Massive BOM reduction",
      "Extensive reference designs"
    ],
    "useCases": [
      "5G Telecom Infrastructure",
      "Software-Defined Radios",
      "Defense Comms"
    ],
    "resources": {
      "websiteUrl": "https://analog.com"
    }
  },
  {
    "id": "prod-analog-2",
    "name": "LTC6811 Multi-Cell Battery Monitor IC",
    "tagline": "Automotive Precision BMS Silicon",
    "company": "Analog Devices",
    "category": "Analog & Mixed-Signal ICs",
    "booth": "15-16",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696265/46-analog-devices.jpg",
    "views": 810,
    "enquiries": 65,
    "interestedVisitorsCount": 130,
    "overview": "Measures up to 12 series connected battery cells with total measurement error under 1.2mV. IsoSPI isolated serial interface enables high-voltage EV packs.",
    "features": [
      "AEC-Q100 Qualified",
      "Built-in IsoSPI Isolated Comms",
      "Passive Cell Balancing"
    ],
    "benefits": [
      "Highest cell voltage accuracy",
      "Maximized EV battery life",
      "ASIL-D compliant design"
    ],
    "useCases": [
      "Electric Vehicles (2W/3W/4W)",
      "Grid Energy Storage",
      "High-Voltage Industrial Battery Systems"
    ],
    "resources": {
      "websiteUrl": "https://analog.com"
    }
  },
  {
    "id": "prod-teradyne-1",
    "name": "UltraFLEXplus Advanced Test Platform",
    "tagline": "Industry-Leading Semiconductor ATE System",
    "company": "Teradyne",
    "category": "ATE & Testing Solutions",
    "booth": "24",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696229/38-teradyne.jpg",
    "views": 790,
    "enquiries": 60,
    "interestedVisitorsCount": 140,
    "overview": "Delivers maximum throughput and lowest cost-of-test for high-complexity AI processors, mobile APs, and automotive automotive radar devices.",
    "features": [
      "PACE Multi-Site Architecture",
      "Extreme Pin-Count Density",
      "Ultra-Fast RF Instrumentation"
    ],
    "benefits": [
      "Fastest yield learning",
      "Reduced test time per device",
      "Proven worldwide production footprint"
    ],
    "useCases": [
      "OSAT Production Testing",
      "AI Processor Validation",
      "Automotive MCU Screening"
    ],
    "resources": {
      "websiteUrl": "https://teradyne.com"
    }
  },
  {
    "id": "prod-indiesemic-1",
    "name": "Automotive Radar & Sensor Fusion SoC",
    "tagline": "Next-Gen 77GHz Radar Processor",
    "company": "Indiesemic Private Limited",
    "category": "Fabless Semiconductor",
    "booth": "59",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696192/34-indiesemic-private-limited.jpg",
    "views": 660,
    "enquiries": 48,
    "interestedVisitorsCount": 115,
    "overview": "Integrated fabless chip combining multi-channel FMCW radar processing, DSP algorithms, and CAN-FD interface for ADAS safety systems.",
    "features": [
      "AEC-Q100 Grade 1",
      "Hardware Radar FFT Accelerator",
      "Integrated Power Management"
    ],
    "benefits": [
      "Direct sensor-to-ECU telemetry",
      "Compact sensor head design",
      "Optimized power dissipation"
    ],
    "useCases": [
      "Automotive ADAS",
      "Autonomous Industrial AGVs",
      "Perimeter Surveillance"
    ],
    "resources": {
      "websiteUrl": "https://indiesemic.com"
    }
  },
  {
    "id": "prod-rackbank-1",
    "name": "Green AI GPU Cloud & Datacenter Facility",
    "tagline": "Sustainable Computing for Chip EDA Workloads",
    "company": "RackBank",
    "category": "Data Centers & Cloud",
    "booth": "11, 12",
    "image": "https://res.cloudinary.com/vc0wtqtw/image/upload/v1792696082/10-rackbank-datacenters-pvt-ltd.jpg",
    "views": 740,
    "enquiries": 58,
    "interestedVisitorsCount": 125,
    "overview": "Tier-3 green datacenter campus located in Indore, Madhya Pradesh offering high-density liquid cooling for massive silicon simulation and EDA regressions.",
    "features": [
      "100% Green Energy Pledges",
      "Liquid-Cooled GPU Racks",
      "Ultra-Low Latency Fiber Ring"
    ],
    "benefits": [
      "Lower operational costs for EDA compute",
      "Secure sovereign Indian cloud hosting",
      "Zero water-waste cooling"
    ],
    "useCases": [
      "Semiconductor Simulation",
      "AI Model Fine-tuning",
      "Fabless Design R&D Teams"
    ],
    "resources": {
      "websiteUrl": "https://rackbank.com"
    }
  },
  {
    "id": "prod-pine-1",
    "name": "Semiconductor Tapeout & STA Certification",
    "tagline": "Hands-on VLSI Physical Design Masterclass",
    "company": "Futurewiz",
    "category": "Skill Development & EDA",
    "booth": "48",
    "image": "",
    "views": 630,
    "enquiries": 50,
    "interestedVisitorsCount": 112,
    "overview": "Intensive training program tailored for engineering graduates and VLSI professionals covering advanced synthesis, PnR, Static Timing Analysis, and DRC/LVS.",
    "features": [
      "Real PDKs and EDA Tool Flow",
      "Mentorship from Silicon Veterans",
      "100% Placement Record"
    ],
    "benefits": [
      "Job-ready silicon engineers",
      "Bridges academia-industry gap",
      "Hands-on chip tapeout experience"
    ],
    "useCases": [
      "Engineering Colleges",
      "Early-career VLSI Engineers",
      "Workforce Skilling Initiatives"
    ],
    "resources": {
      "websiteUrl": "https://pinetrainingacademy.com"
    }
  }
];

export const GENERATED_ATTENDEES = generateAttendees(2389);
