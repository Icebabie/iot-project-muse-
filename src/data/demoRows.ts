/** Demo feed rows: REAL station measurements sampled from processed/aqua_clean_full.csv
 * (India Aquaattributes, 1,361 stations) via the 6-parameter augmented file.
 * ph / temperature / dissolvedOxygen / conductivity are measured values;
 * tds is derived (0.64 x conductivity); turbidity is synthetic (see
 * docs/DATASET_AUGMENTATION.md). Used ONLY by demo mode (device DEMO-001). */
export interface DemoRow { ph: number; turbidity: number; temperature: number; tds: number; conductivity: number; dissolvedOxygen: number; station: string; state: string }
export const DEMO_ROWS: DemoRow[] = [
 {
  "ph": 7.51,
  "turbidity": 2.7,
  "temperature": 25.0,
  "tds": 129,
  "conductivity": 201,
  "dissolvedOxygen": 6.5,
  "station": "Godavari At U/S Of Gangapur Dam,Nasik",
  "state": "Maharashtra"
 },
 {
  "ph": 7.83,
  "turbidity": 3.27,
  "temperature": 25.9,
  "tds": 160,
  "conductivity": 249,
  "dissolvedOxygen": 7.4,
  "station": "Bheden B/C With Ib River",
  "state": "Orissa"
 },
 {
  "ph": 7.88,
  "turbidity": 1.31,
  "temperature": 28.9,
  "tds": 151,
  "conductivity": 236,
  "dissolvedOxygen": 6.9,
  "station": "Hasdeo At U/S Of Champa",
  "state": "Chhattisgarh"
 },
 {
  "ph": 8.08,
  "turbidity": 4.79,
  "temperature": 27.3,
  "tds": 344,
  "conductivity": 537,
  "dissolvedOxygen": 6.8,
  "station": "Godavari At U/S Of Paithan At Paithan Inta",
  "state": "Maharashtra"
 },
 {
  "ph": 8.12,
  "turbidity": 2.15,
  "temperature": 18.4,
  "tds": 90,
  "conductivity": 141,
  "dissolvedOxygen": 9.1,
  "station": "Alkananda B/C To Bhagirathi At Devprayag",
  "state": "Uttarakhand"
 },
 {
  "ph": 8.0,
  "turbidity": 1.47,
  "temperature": 8.0,
  "tds": 42,
  "conductivity": 65,
  "dissolvedOxygen": 9.0,
  "station": "Parvati At U/S Manikaran",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.0,
  "turbidity": 5.19,
  "temperature": 27.0,
  "tds": 197,
  "conductivity": 308,
  "dissolvedOxygen": 7.0,
  "station": "Ground Around Stp Dinapur,Varanasi, U.P",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 8.17,
  "turbidity": 2.82,
  "temperature": 25.8,
  "tds": 202,
  "conductivity": 316,
  "dissolvedOxygen": 8.6,
  "station": "Ganga At Kanpur U/S (Ranighat)",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.5,
  "turbidity": 1.93,
  "temperature": 27.0,
  "tds": 447,
  "conductivity": 699,
  "dissolvedOxygen": 7.5,
  "station": "Dahanu",
  "state": "Maharashtra "
 },
 {
  "ph": 6.77,
  "turbidity": 1.49,
  "temperature": 26.4,
  "tds": 50,
  "conductivity": 78,
  "dissolvedOxygen": 2.0,
  "station": "R Kadambayar At Manckakadavu",
  "state": "Kerala"
 },
 {
  "ph": 6.92,
  "turbidity": 2.04,
  "temperature": 29.2,
  "tds": 1620,
  "conductivity": 2530,
  "dissolvedOxygen": 6.7,
  "station": "R Neelaswaram At Nambiarkal Dam",
  "state": "Kerala"
 },
 {
  "ph": 7.83,
  "turbidity": 4.57,
  "temperature": 20.2,
  "tds": 506,
  "conductivity": 791,
  "dissolvedOxygen": 5.5,
  "station": "Wardha At D/S Of Erai River, Hadasti, Chan",
  "state": "Maharashtra"
 },
 {
  "ph": 7.0,
  "turbidity": 1.96,
  "temperature": 24.6,
  "tds": 49,
  "conductivity": 76,
  "dissolvedOxygen": 6.7,
  "station": "Kabbani At Muthankara",
  "state": "Kerala"
 },
 {
  "ph": 7.6,
  "turbidity": 0.99,
  "temperature": 26.0,
  "tds": 668,
  "conductivity": 1044,
  "dissolvedOxygen": 7.6,
  "station": "Vasai",
  "state": "Maharashtra "
 },
 {
  "ph": 7.03,
  "turbidity": 4.35,
  "temperature": 23.7,
  "tds": 267,
  "conductivity": 417,
  "dissolvedOxygen": 5.9,
  "station": "At Namkum Road Bridge",
  "state": "Jharkhand"
 },
 {
  "ph": 7.96,
  "turbidity": 4.42,
  "temperature": 20.2,
  "tds": 446,
  "conductivity": 697,
  "dissolvedOxygen": 6.0,
  "station": "Wardha At U/S Of Erai River Hadasti,Chandr",
  "state": "Maharashtra"
 },
 {
  "ph": 6.9,
  "turbidity": 1.25,
  "temperature": 27.0,
  "tds": 33,
  "conductivity": 52,
  "dissolvedOxygen": 6.8,
  "station": "R Peruvamba At Chandappura",
  "state": "Kerala"
 },
 {
  "ph": 7.3,
  "turbidity": 2.24,
  "temperature": 23.0,
  "tds": 240,
  "conductivity": 375,
  "dissolvedOxygen": 7.3,
  "station": "Handpump In Village Damauda At Kashipur Ne",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.6,
  "turbidity": 2.75,
  "temperature": 22.6,
  "tds": 443,
  "conductivity": 692,
  "dissolvedOxygen": 7.7,
  "station": "Sankh At Tigra Reservoir",
  "state": "Madhya Pradesh"
 },
 {
  "ph": 7.7,
  "turbidity": 1.08,
  "temperature": 28.0,
  "tds": 241,
  "conductivity": 376,
  "dissolvedOxygen": 7.7,
  "station": "Barrakpore Municipality",
  "state": "West Bengal"
 },
 {
  "ph": 6.3,
  "turbidity": 1.38,
  "temperature": 24.8,
  "tds": 140,
  "conductivity": 218,
  "dissolvedOxygen": 6.3,
  "station": "Industrial Estate, Byrnihat, Meghalaya",
  "state": "Meghalaya"
 },
 {
  "ph": 7.34,
  "turbidity": 3.13,
  "temperature": 26.2,
  "tds": 126,
  "conductivity": 196,
  "dissolvedOxygen": 6.9,
  "station": "Tungha At D/S Of Shimoga Town, Karnataka",
  "state": "Karnataka"
 },
 {
  "ph": 7.92,
  "turbidity": 3.47,
  "temperature": 27.4,
  "tds": 106,
  "conductivity": 166,
  "dissolvedOxygen": 7.7,
  "station": "Brahmani At Kamalanga",
  "state": "Orissa"
 },
 {
  "ph": 8.09,
  "turbidity": 4.6,
  "temperature": 30.8,
  "tds": 855,
  "conductivity": 1336,
  "dissolvedOxygen": 5.0,
  "station": "Chandrabhaga D/S Of Pandharpur Town",
  "state": "Maharashtra"
 },
 {
  "ph": 6.5,
  "turbidity": 2.33,
  "temperature": 26.5,
  "tds": 56,
  "conductivity": 88,
  "dissolvedOxygen": 6.5,
  "station": "Karoor (Pala)",
  "state": "Kerala"
 },
 {
  "ph": 7.6,
  "turbidity": 1.13,
  "temperature": 29.0,
  "tds": 1469,
  "conductivity": 2295,
  "dissolvedOxygen": 7.6,
  "station": "Well Kothi In Village Bagar Rajput, Alwar",
  "state": "Rajasthan"
 },
 {
  "ph": 6.85,
  "turbidity": 3.43,
  "temperature": 16.3,
  "tds": 72,
  "conductivity": 112,
  "dissolvedOxygen": 7.8,
  "station": "Mirikh Lake",
  "state": "West Bengal"
 },
 {
  "ph": 7.4,
  "turbidity": 1.76,
  "temperature": 24.3,
  "tds": 211,
  "conductivity": 329,
  "dissolvedOxygen": 7.5,
  "station": "Seonath River Water Supply Well, Durg.",
  "state": "Chhattisgarh"
 },
 {
  "ph": 8.0,
  "turbidity": 1.61,
  "temperature": 19.0,
  "tds": 135,
  "conductivity": 211,
  "dissolvedOxygen": 8.0,
  "station": "Beas At D/S Jaisinghpur",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.25,
  "turbidity": 8.85,
  "temperature": 19.8,
  "tds": 364,
  "conductivity": 568,
  "dissolvedOxygen": 2.0,
  "station": "Hindon At Ghaziabad D/S",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.42,
  "turbidity": 6.0,
  "temperature": 19.6,
  "tds": 142,
  "conductivity": 221,
  "dissolvedOxygen": 8.2,
  "station": "Ganga At Garhmukteshwar",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.15,
  "turbidity": 2.43,
  "temperature": 26.3,
  "tds": 267,
  "conductivity": 417,
  "dissolvedOxygen": 6.4,
  "station": "Hasdeo At U/S Korba",
  "state": "Chhattisgarh"
 },
 {
  "ph": 8.0,
  "turbidity": 3.84,
  "temperature": 27.5,
  "tds": 336,
  "conductivity": 525,
  "dissolvedOxygen": 7.1,
  "station": "Tapi At Surat U/S Kathore",
  "state": "Gujarat"
 },
 {
  "ph": 6.94,
  "turbidity": 2.61,
  "temperature": 23.6,
  "tds": 267,
  "conductivity": 417,
  "dissolvedOxygen": 7.4,
  "station": "Karo At Lohojimi U/S",
  "state": "Jharkhand"
 },
 {
  "ph": 7.49,
  "turbidity": 1.68,
  "temperature": 27.4,
  "tds": 272,
  "conductivity": 426,
  "dissolvedOxygen": 7.1,
  "station": "Chillar At Shajapur",
  "state": "Madhya Pradesh"
 },
 {
  "ph": 7.98,
  "turbidity": 5.79,
  "temperature": 24.0,
  "tds": 250,
  "conductivity": 391,
  "dissolvedOxygen": 8.0,
  "station": "Daha River At Itwa Bridge, Siwan",
  "state": "Bihar"
 },
 {
  "ph": 7.4,
  "turbidity": 9.97,
  "temperature": 22.1,
  "tds": 267,
  "conductivity": 417,
  "dissolvedOxygen": 5.9,
  "station": "Ranchi Lake,Ranchi",
  "state": "Jharkhand"
 },
 {
  "ph": 6.6,
  "turbidity": 1.74,
  "temperature": 27.3,
  "tds": 335,
  "conductivity": 523,
  "dissolvedOxygen": 6.6,
  "station": "Ground Water Point Inside Burdwan Universi",
  "state": "West Bengal"
 },
 {
  "ph": 7.6,
  "turbidity": 2.65,
  "temperature": 21.0,
  "tds": 315,
  "conductivity": 492,
  "dissolvedOxygen": 7.6,
  "station": "Sukali, Amravati",
  "state": "Maharashtra "
 },
 {
  "ph": 6.7,
  "turbidity": 1.41,
  "temperature": 27.5,
  "tds": 6144,
  "conductivity": 9600,
  "dissolvedOxygen": 6.7,
  "station": "Well Of Pema Ram Mali, Bhituja ",
  "state": "Rajasthan"
 },
 {
  "ph": 7.3,
  "turbidity": 3.68,
  "temperature": 15.0,
  "tds": 435,
  "conductivity": 680,
  "dissolvedOxygen": 7.3,
  "station": "Hand Pump At Chamba Town",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.03,
  "turbidity": 3.06,
  "temperature": 22.0,
  "tds": 116,
  "conductivity": 182,
  "dissolvedOxygen": 7.1,
  "station": "Kharsang B/C Buridihing Near Kharsang",
  "state": "Assam"
 },
 {
  "ph": 7.9,
  "turbidity": 2.27,
  "temperature": 23.2,
  "tds": 675,
  "conductivity": 1054,
  "dissolvedOxygen": 7.9,
  "station": "B/W. - Swarnamukhi River, Srikalahasti, Ch",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 7.63,
  "turbidity": 2.44,
  "temperature": 25.1,
  "tds": 171,
  "conductivity": 267,
  "dissolvedOxygen": 6.2,
  "station": "Darna Aswali (Darna Dam), Lgatpuri, Nashik",
  "state": "Maharashtra"
 },
 {
  "ph": 7.3,
  "turbidity": 2.98,
  "temperature": 29.0,
  "tds": 832,
  "conductivity": 1300,
  "dissolvedOxygen": 7.3,
  "station": "In Side Shiv Temple Near Air Force Station",
  "state": "Rajasthan"
 },
 {
  "ph": 6.12,
  "turbidity": 5.59,
  "temperature": 26.2,
  "tds": 181,
  "conductivity": 283,
  "dissolvedOxygen": 7.2,
  "station": "Teesta A/C Rangichu After Meeting The Indl",
  "state": "Sikkim"
 },
 {
  "ph": 7.93,
  "turbidity": 3.26,
  "temperature": 32.5,
  "tds": 279,
  "conductivity": 436,
  "dissolvedOxygen": 7.8,
  "station": "Betwa Near Intake Point, Vidisha",
  "state": "Madhya Pradesh"
 },
 {
  "ph": 7.63,
  "turbidity": 3.26,
  "temperature": 24.7,
  "tds": 97,
  "conductivity": 152,
  "dissolvedOxygen": 7.7,
  "station": "Baitarni At Joda ",
  "state": "Orissa"
 },
 {
  "ph": 7.6,
  "turbidity": 1.61,
  "temperature": 29.0,
  "tds": 550,
  "conductivity": 860,
  "dissolvedOxygen": 7.6,
  "station": "Village Agyara, Tehsil- Ramgarh, Alwar",
  "state": "Rajasthan"
 },
 {
  "ph": 7.58,
  "turbidity": 3.97,
  "temperature": 25.3,
  "tds": 230,
  "conductivity": 359,
  "dissolvedOxygen": 6.4,
  "station": "Godavari At Nandur- Madmeshwar Dam.",
  "state": "Maharashtra"
 },
 {
  "ph": 7.93,
  "turbidity": 1.28,
  "temperature": 26.0,
  "tds": 113,
  "conductivity": 176,
  "dissolvedOxygen": 7.8,
  "station": "Brahmani At Dharmashala",
  "state": "Orissa"
 },
 {
  "ph": 7.81,
  "turbidity": 6.2,
  "temperature": 26.0,
  "tds": 685,
  "conductivity": 1070,
  "dissolvedOxygen": 4.3,
  "station": "Yamuna At Agra U/S",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 5.9,
  "turbidity": 3.12,
  "temperature": 29.0,
  "tds": 118,
  "conductivity": 185,
  "dissolvedOxygen": 5.9,
  "station": "Well At Zuari Ind. Ltd, Zuari Nagar",
  "state": "Goa"
 },
 {
  "ph": 8.0,
  "turbidity": 2.28,
  "temperature": 20.0,
  "tds": 233,
  "conductivity": 364,
  "dissolvedOxygen": 8.0,
  "station": "Sirsa , U/S Sitomajri Nallahgarh",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.4,
  "turbidity": 1.79,
  "temperature": 28.5,
  "tds": 5216,
  "conductivity": 8150,
  "dissolvedOxygen": 7.4,
  "station": "Cwr Of Phed, Bhituja ",
  "state": "Rajasthan"
 },
 {
  "ph": 7.5,
  "turbidity": 1.65,
  "temperature": 26.2,
  "tds": 633,
  "conductivity": 989,
  "dissolvedOxygen": 7.5,
  "station": "Site 1, Industrial Area Near M/S Woodwarm ",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 8.04,
  "turbidity": 5.16,
  "temperature": 21.2,
  "tds": 335,
  "conductivity": 524,
  "dissolvedOxygen": 5.8,
  "station": "Nira At Pulgaon Cotton Mill",
  "state": "Maharashtra"
 },
 {
  "ph": 7.4,
  "turbidity": 1.03,
  "temperature": 22.0,
  "tds": 467,
  "conductivity": 730,
  "dissolvedOxygen": 7.4,
  "station": "Well-2 At Nalanda",
  "state": "Bihar"
 },
 {
  "ph": 7.1,
  "turbidity": 5.43,
  "temperature": 27.0,
  "tds": 1759,
  "conductivity": 2749,
  "dissolvedOxygen": 7.1,
  "station": "B/W  -Near Ckm College , Enumamula (V) ,Wa",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 7.63,
  "turbidity": 10.87,
  "temperature": 26.5,
  "tds": 828,
  "conductivity": 1294,
  "dissolvedOxygen": 2.0,
  "station": "Musi D/S At Hyderabad, A.P.",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 7.55,
  "turbidity": 2.63,
  "temperature": 27.3,
  "tds": 228,
  "conductivity": 356,
  "dissolvedOxygen": 6.6,
  "station": "Tungabhadra At Jackwell Point, Karnataka",
  "state": "Karnataka"
 },
 {
  "ph": 7.0,
  "turbidity": 5.45,
  "temperature": 21.0,
  "tds": 215,
  "conductivity": 336,
  "dissolvedOxygen": 7.0,
  "station": "Satluj At U/S Head Works Ropar",
  "state": " Punjab"
 },
 {
  "ph": 7.77,
  "turbidity": 3.49,
  "temperature": 25.8,
  "tds": 285,
  "conductivity": 445,
  "dissolvedOxygen": 2.0,
  "station": "Mula At Harrison Bridge Near Mula- Pawana ",
  "state": "Maharashtra"
 },
 {
  "ph": 8.05,
  "turbidity": 3.9,
  "temperature": 18.4,
  "tds": 85,
  "conductivity": 132,
  "dissolvedOxygen": 8.7,
  "station": "Alkananda A/C With Bhagirathi At Devprayag",
  "state": "Uttarakhand"
 },
 {
  "ph": 7.86,
  "turbidity": 3.81,
  "temperature": 28.2,
  "tds": 123,
  "conductivity": 192,
  "dissolvedOxygen": 7.8,
  "station": "Brahmani At Bonaigarh",
  "state": "Orissa"
 },
 {
  "ph": 7.32,
  "turbidity": 10.84,
  "temperature": 30.0,
  "tds": 1127,
  "conductivity": 1761,
  "dissolvedOxygen": 2.5,
  "station": "Vasista At Salem, D/S Of Sago Indusries Ef",
  "state": "Tamil Nadu"
 },
 {
  "ph": 7.9,
  "turbidity": 2.2,
  "temperature": 31.0,
  "tds": 1338,
  "conductivity": 2090,
  "dissolvedOxygen": 7.9,
  "station": "Near Ioc Refinery Haldia, West Bengal",
  "state": "West Bengal"
 },
 {
  "ph": 7.1,
  "turbidity": 2.15,
  "temperature": 26.2,
  "tds": 2024,
  "conductivity": 3163,
  "dissolvedOxygen": 7.1,
  "station": "Site 2, Industrial Area Near M/S Amin Sons",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 5.9,
  "turbidity": 3.84,
  "temperature": 29.0,
  "tds": 184,
  "conductivity": 288,
  "dissolvedOxygen": 5.8,
  "station": "Khandagiri Area, Bhubaneswar, Orissa",
  "state": "Orissa "
 },
 {
  "ph": 8.0,
  "turbidity": 2.05,
  "temperature": 28.0,
  "tds": 4224,
  "conductivity": 6600,
  "dissolvedOxygen": 8.0,
  "station": "Well Of Loomji, Chaudhary, Near Nayagaon, ",
  "state": "Rajasthan"
 },
 {
  "ph": 7.96,
  "turbidity": 6.21,
  "temperature": 29.5,
  "tds": 292,
  "conductivity": 457,
  "dissolvedOxygen": 6.3,
  "station": "Damodar Near Mujher Mana Village A/C Tamla",
  "state": "West Bengal"
 },
 {
  "ph": 7.91,
  "turbidity": 3.37,
  "temperature": 28.2,
  "tds": 69,
  "conductivity": 108,
  "dissolvedOxygen": 7.1,
  "station": "Amba River At D/S Of Waken Bridge-U/S Of J",
  "state": "Maharashtra"
 },
 {
  "ph": 8.21,
  "turbidity": 5.61,
  "temperature": 27.2,
  "tds": 476,
  "conductivity": 744,
  "dissolvedOxygen": 9.7,
  "station": "Yamuna At Juhika B/C With Chanbal, Etawah",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.0,
  "turbidity": 1.85,
  "temperature": 16.0,
  "tds": 198,
  "conductivity": 310,
  "dissolvedOxygen": 7.0,
  "station": "U/S Goindwal",
  "state": " Punjab"
 },
 {
  "ph": 7.6,
  "turbidity": 1.71,
  "temperature": 23.0,
  "tds": 774,
  "conductivity": 1210,
  "dissolvedOxygen": 7.6,
  "station": "Outside Jln Hospital, Ajmer",
  "state": "Rajasthan"
 },
 {
  "ph": 6.6,
  "turbidity": 2.04,
  "temperature": 28.3,
  "tds": 74,
  "conductivity": 115,
  "dissolvedOxygen": 6.6,
  "station": "Kureepuzha  (Kollam)",
  "state": "Kerala"
 },
 {
  "ph": 7.66,
  "turbidity": 2.5,
  "temperature": 26.0,
  "tds": 130,
  "conductivity": 202,
  "dissolvedOxygen": 6.8,
  "station": "Malprabha At D/S Of Khanapur Village,Karna",
  "state": "Karnataka"
 },
 {
  "ph": 8.1,
  "turbidity": 2.04,
  "temperature": 23.5,
  "tds": 367,
  "conductivity": 574,
  "dissolvedOxygen": 8.1,
  "station": "Bhojpur",
  "state": "Bihar"
 },
 {
  "ph": 7.9,
  "turbidity": 4.95,
  "temperature": 25.5,
  "tds": 311,
  "conductivity": 486,
  "dissolvedOxygen": 7.9,
  "station": "Dug Well At Ghane Kunt, Near Awasthi, Owne",
  "state": "Maharashtra "
 },
 {
  "ph": 7.0,
  "turbidity": 1.85,
  "temperature": 28.8,
  "tds": 12338,
  "conductivity": 19279,
  "dissolvedOxygen": 4.0,
  "station": "R Ramapuram At Ramapuram Bridge",
  "state": "Kerala"
 },
 {
  "ph": 7.73,
  "turbidity": 9.49,
  "temperature": 28.1,
  "tds": 267,
  "conductivity": 417,
  "dissolvedOxygen": 3.8,
  "station": "Yamuna At Mathura U/S",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.2,
  "turbidity": 6.46,
  "temperature": 27.2,
  "tds": 195,
  "conductivity": 304,
  "dissolvedOxygen": 7.2,
  "station": "Gopiganj Industrial Area Bhadohi, Varanasi",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 8.03,
  "turbidity": 4.25,
  "temperature": 27.3,
  "tds": 690,
  "conductivity": 1078,
  "dissolvedOxygen": 5.0,
  "station": "Sina Near Laboti Toll Naka, Laboti, Mohal,",
  "state": "Maharashtra"
 },
 {
  "ph": 7.92,
  "turbidity": 2.83,
  "temperature": 28.1,
  "tds": 13055,
  "conductivity": 20399,
  "dissolvedOxygen": 7.2,
  "station": "Chilka Lake (Ramsar Site)",
  "state": "Orissa"
 },
 {
  "ph": 7.25,
  "turbidity": 8.67,
  "temperature": 20.4,
  "tds": 472,
  "conductivity": 738,
  "dissolvedOxygen": 7.2,
  "station": "Hindon At Sardhana Budhana Road, Village B",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.83,
  "turbidity": 2.81,
  "temperature": 20.2,
  "tds": 499,
  "conductivity": 780,
  "dissolvedOxygen": 6.0,
  "station": "Penganga D/S Of Isapur Dam, Isapur, Pusad,",
  "state": "Maharashtra"
 },
 {
  "ph": 7.75,
  "turbidity": 5.15,
  "temperature": 21.9,
  "tds": 637,
  "conductivity": 995,
  "dissolvedOxygen": 5.2,
  "station": "Purna A/C Morna, Nandura Vill.",
  "state": "Maharashtra"
 },
 {
  "ph": 8.0,
  "turbidity": 1.32,
  "temperature": 10.0,
  "tds": 65,
  "conductivity": 102,
  "dissolvedOxygen": 9.0,
  "station": "Beas At D/S Kulu",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.7,
  "turbidity": 2.96,
  "temperature": 26.2,
  "tds": 289,
  "conductivity": 452,
  "dissolvedOxygen": 7.7,
  "station": "Deva Road, Industrial Area, Chainhat, Lko ",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 8.0,
  "turbidity": 3.41,
  "temperature": 26.5,
  "tds": 180,
  "conductivity": 282,
  "dissolvedOxygen": 6.8,
  "station": "Kabbani At Cause Way  Sattur",
  "state": "Karnataka"
 },
 {
  "ph": 7.61,
  "turbidity": 2.12,
  "temperature": 27.9,
  "tds": 435,
  "conductivity": 680,
  "dissolvedOxygen": 6.4,
  "station": "Krishna At Amaravati , Guntur",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 8.29,
  "turbidity": 6.91,
  "temperature": 23.8,
  "tds": 1016,
  "conductivity": 1588,
  "dissolvedOxygen": 4.1,
  "station": "Nira At Sangavi, Phaltan, Satara",
  "state": "Maharashtra"
 },
 {
  "ph": 6.9,
  "turbidity": 4.96,
  "temperature": 29.2,
  "tds": 60,
  "conductivity": 94,
  "dissolvedOxygen": 6.3,
  "station": "R Ayroor At Ayroor Bridge",
  "state": "Kerala"
 },
 {
  "ph": 6.11,
  "turbidity": 1.53,
  "temperature": 25.8,
  "tds": 56,
  "conductivity": 87,
  "dissolvedOxygen": 7.3,
  "station": "River Kalna At Chandel- Pernem",
  "state": "Goa"
 },
 {
  "ph": 7.85,
  "turbidity": 2.47,
  "temperature": 26.2,
  "tds": 89,
  "conductivity": 139,
  "dissolvedOxygen": 7.1,
  "station": "Pehlar Dam On Pehlar R. Inlet Of Water Wor",
  "state": "Maharashtra"
 },
 {
  "ph": 7.2,
  "turbidity": 2.83,
  "temperature": 29.2,
  "tds": 9831,
  "conductivity": 15362,
  "dissolvedOxygen": 6.2,
  "station": "R Neelaswaram At Hosdurg",
  "state": "Kerala"
 },
 {
  "ph": 7.98,
  "turbidity": 2.04,
  "temperature": 22.4,
  "tds": 159,
  "conductivity": 249,
  "dissolvedOxygen": 7.7,
  "station": "Subarnarekha At Rajghat Near Bihar Border",
  "state": "Orissa"
 },
 {
  "ph": 7.5,
  "turbidity": 2.49,
  "temperature": 26.5,
  "tds": 628,
  "conductivity": 981,
  "dissolvedOxygen": 7.5,
  "station": "Uluberia  College At Howrah",
  "state": "West Bengal"
 },
 {
  "ph": 8.32,
  "turbidity": 4.34,
  "temperature": 27.6,
  "tds": 366,
  "conductivity": 572,
  "dissolvedOxygen": 9.2,
  "station": "Chambal At Etawah B/C Yamuna",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 8.02,
  "turbidity": 1.87,
  "temperature": 24.0,
  "tds": 380,
  "conductivity": 594,
  "dissolvedOxygen": 7.8,
  "station": "Yamuna At Wazirabad",
  "state": "Delhi"
 },
 {
  "ph": 8.3,
  "turbidity": 2.63,
  "temperature": 23.0,
  "tds": 769,
  "conductivity": 1202,
  "dissolvedOxygen": 8.3,
  "station": "Bhahmni, Kalmeshwar, Nagpur",
  "state": "Maharashtra "
 },
 {
  "ph": 6.85,
  "turbidity": 3.19,
  "temperature": 23.5,
  "tds": 254,
  "conductivity": 398,
  "dissolvedOxygen": 6.7,
  "station": "Hiranmei Pukhuri At Thoubal",
  "state": "Manipur"
 },
 {
  "ph": 7.51,
  "turbidity": 11.9,
  "temperature": 24.6,
  "tds": 469,
  "conductivity": 733,
  "dissolvedOxygen": 3.9,
  "station": "Suswa River At Mothrawala, Dehradun",
  "state": "Uttarakhand"
 },
 {
  "ph": 8.25,
  "turbidity": 2.48,
  "temperature": 27.1,
  "tds": 227,
  "conductivity": 354,
  "dissolvedOxygen": 7.7,
  "station": "Mahi Near Rajasthan Border At Kadana Dam",
  "state": "Gujarat"
 },
 {
  "ph": 8.02,
  "turbidity": 1.98,
  "temperature": 26.2,
  "tds": 124,
  "conductivity": 193,
  "dissolvedOxygen": 8.0,
  "station": "Bhavani At Sirumugai",
  "state": "Tamilnadu"
 },
 {
  "ph": 7.79,
  "turbidity": 2.1,
  "temperature": 24.6,
  "tds": 264,
  "conductivity": 413,
  "dissolvedOxygen": 7.3,
  "station": "Ganga At Punpun, Patna",
  "state": "Bihar"
 },
 {
  "ph": 7.17,
  "turbidity": 4.1,
  "temperature": 12.6,
  "tds": 93,
  "conductivity": 145,
  "dissolvedOxygen": 7.1,
  "station": "Barak At D/S Of Silchar",
  "state": "Assam"
 },
 {
  "ph": 7.12,
  "turbidity": 2.75,
  "temperature": 27.8,
  "tds": 30,
  "conductivity": 46,
  "dissolvedOxygen": 8.0,
  "station": "Rsvr At Edamalayar",
  "state": "Kerala"
 },
 {
  "ph": 7.5,
  "turbidity": 4.05,
  "temperature": 24.0,
  "tds": 211,
  "conductivity": 330,
  "dissolvedOxygen": 7.6,
  "station": "Kharoon River B/C Khapri Drain, Durg, Raip",
  "state": "Chhattisgarh"
 },
 {
  "ph": 7.82,
  "turbidity": 4.19,
  "temperature": 26.7,
  "tds": 102,
  "conductivity": 159,
  "dissolvedOxygen": 7.6,
  "station": "Water Intake Point For Suri Town On R. May",
  "state": "West Bengal"
 },
 {
  "ph": 7.5,
  "turbidity": 0.81,
  "temperature": 31.2,
  "tds": 612,
  "conductivity": 957,
  "dissolvedOxygen": 7.5,
  "station": "Durgapur Town,Near Iisco, Burdwan, West Be",
  "state": "West Bengal"
 },
 {
  "ph": 8.0,
  "turbidity": 3.02,
  "temperature": 13.0,
  "tds": 154,
  "conductivity": 240,
  "dissolvedOxygen": 8.0,
  "station": "Jhelam At Anantnag D/S",
  "state": "Jammu & Kashmir"
 },
 {
  "ph": 8.24,
  "turbidity": 5.98,
  "temperature": 30.3,
  "tds": 475,
  "conductivity": 743,
  "dissolvedOxygen": 9.7,
  "station": "Hanuman Ghat On Dudhpukur At Tarakeshwar",
  "state": "West Bengal"
 },
 {
  "ph": 7.0,
  "turbidity": 3.71,
  "temperature": 22.0,
  "tds": 182,
  "conductivity": 284,
  "dissolvedOxygen": 7.0,
  "station": "U/S Budha Nallah (Upper)",
  "state": " Punjab"
 },
 {
  "ph": 7.84,
  "turbidity": 2.9,
  "temperature": 27.4,
  "tds": 276,
  "conductivity": 432,
  "dissolvedOxygen": 6.8,
  "station": "Godavari At Latur Water Intake Near Pump H",
  "state": "Maharashtra"
 },
 {
  "ph": 7.9,
  "turbidity": 1.44,
  "temperature": 10.3,
  "tds": 159,
  "conductivity": 248,
  "dissolvedOxygen": 7.9,
  "station": "Hand Pump At Shimla",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.0,
  "turbidity": 2.52,
  "temperature": 23.0,
  "tds": 181,
  "conductivity": 283,
  "dissolvedOxygen": 7.0,
  "station": "D/S Hussaniwala-H/W Ferozepur",
  "state": " Punjab"
 },
 {
  "ph": 7.8,
  "turbidity": 3.14,
  "temperature": 29.5,
  "tds": 213,
  "conductivity": 332,
  "dissolvedOxygen": 7.7,
  "station": "Kharoon River Bundri, Raipur",
  "state": "Chhattisgarh"
 },
 {
  "ph": 7.87,
  "turbidity": 2.24,
  "temperature": 26.4,
  "tds": 175,
  "conductivity": 274,
  "dissolvedOxygen": 7.6,
  "station": "Narmada At Chandod",
  "state": "Gujarat"
 },
 {
  "ph": 8.23,
  "turbidity": 4.06,
  "temperature": 25.1,
  "tds": 209,
  "conductivity": 327,
  "dissolvedOxygen": 8.4,
  "station": "Ganga At Khurji, Patna U/S",
  "state": "Bihar"
 },
 {
  "ph": 7.2,
  "turbidity": 1.44,
  "temperature": 28.0,
  "tds": 635,
  "conductivity": 992,
  "dissolvedOxygen": 7.2,
  "station": "Barsat Municipality North 24-P, West Benga",
  "state": "West Bengal"
 },
 {
  "ph": 7.8,
  "turbidity": 1.54,
  "temperature": 27.5,
  "tds": 558,
  "conductivity": 872,
  "dissolvedOxygen": 7.8,
  "station": "Behala Calcutta, West Bengal",
  "state": "West Bengal"
 },
 {
  "ph": 7.9,
  "turbidity": 1.41,
  "temperature": 25.0,
  "tds": 1006,
  "conductivity": 1572,
  "dissolvedOxygen": 7.9,
  "station": "Bore Well At Shete Vasti, Near Old Tuljapu",
  "state": "Maharashtra "
 },
 {
  "ph": 6.9,
  "turbidity": 2.4,
  "temperature": 26.8,
  "tds": 45,
  "conductivity": 70,
  "dissolvedOxygen": 6.5,
  "station": "Achenkoil At Chennithula",
  "state": "Kerala"
 },
 {
  "ph": 8.0,
  "turbidity": 0.78,
  "temperature": 29.0,
  "tds": 7176,
  "conductivity": 11213,
  "dissolvedOxygen": 8.0,
  "station": "Bore Well Of Sachin Gidc.",
  "state": "Gujarat"
 },
 {
  "ph": 8.0,
  "turbidity": 1.7,
  "temperature": 11.0,
  "tds": 61,
  "conductivity": 96,
  "dissolvedOxygen": 9.0,
  "station": "Beas At D/S Aut",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.5,
  "turbidity": 1.32,
  "temperature": 25.5,
  "tds": 260,
  "conductivity": 407,
  "dissolvedOxygen": 7.5,
  "station": "At Kala Amb, H.P",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.2,
  "turbidity": 2.19,
  "temperature": 26.5,
  "tds": 570,
  "conductivity": 891,
  "dissolvedOxygen": 7.2,
  "station": "Kalamassery Ernakulam ",
  "state": "Kerala"
 },
 {
  "ph": 7.71,
  "turbidity": 2.23,
  "temperature": 26.5,
  "tds": 417,
  "conductivity": 652,
  "dissolvedOxygen": 5.6,
  "station": "Manjeera At Gowdicharla A/C With Nakkavagu",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 7.4,
  "turbidity": 3.19,
  "temperature": 23.0,
  "tds": 1504,
  "conductivity": 2350,
  "dissolvedOxygen": 7.4,
  "station": "Near Rana Pratap Nagar, Railway Station, U",
  "state": "Rajasthan"
 },
 {
  "ph": 7.79,
  "turbidity": 5.01,
  "temperature": 27.4,
  "tds": 102,
  "conductivity": 160,
  "dissolvedOxygen": 7.3,
  "station": "Brahmani At Talcher Fd/S",
  "state": "Orissa"
 },
 {
  "ph": 7.74,
  "turbidity": 4.14,
  "temperature": 32.5,
  "tds": 343,
  "conductivity": 536,
  "dissolvedOxygen": 6.1,
  "station": "Tapi At Ajnand Village",
  "state": "Maharashtra"
 },
 {
  "ph": 8.1,
  "turbidity": 4.16,
  "temperature": 24.0,
  "tds": 952,
  "conductivity": 1488,
  "dissolvedOxygen": 8.1,
  "station": "Midc, Shinoli, Chendgad",
  "state": "Maharashtra "
 },
 {
  "ph": 8.2,
  "turbidity": 2.34,
  "temperature": 23.5,
  "tds": 287,
  "conductivity": 449,
  "dissolvedOxygen": 8.2,
  "station": "Chapra",
  "state": "Bihar"
 },
 {
  "ph": 7.58,
  "turbidity": 7.98,
  "temperature": 26.0,
  "tds": 338,
  "conductivity": 529,
  "dissolvedOxygen": 2.3,
  "station": "Pawana At Sangavigaon, Pune.",
  "state": "Maharashtra"
 },
 {
  "ph": 7.58,
  "turbidity": 1.9,
  "temperature": 26.8,
  "tds": 233,
  "conductivity": 364,
  "dissolvedOxygen": 7.2,
  "station": "Malei At Jaora",
  "state": "Madhya Pradesh"
 },
 {
  "ph": 7.7,
  "turbidity": 4.46,
  "temperature": 25.5,
  "tds": 586,
  "conductivity": 915,
  "dissolvedOxygen": 7.7,
  "station": "Begusarai",
  "state": "Bihar"
 },
 {
  "ph": 8.17,
  "turbidity": 3.69,
  "temperature": 23.7,
  "tds": 228,
  "conductivity": 357,
  "dissolvedOxygen": 8.4,
  "station": "Ganga At Buxar, Ramrekhaghat",
  "state": "Bihar"
 },
 {
  "ph": 7.7,
  "turbidity": 1.71,
  "temperature": 28.4,
  "tds": 60,
  "conductivity": 94,
  "dissolvedOxygen": 6.0,
  "station": "Kadalundy At Thirurangady",
  "state": "Kerala"
 },
 {
  "ph": 7.77,
  "turbidity": 4.27,
  "temperature": 21.1,
  "tds": 190,
  "conductivity": 297,
  "dissolvedOxygen": 8.8,
  "station": "Ghaghara Near Chapra",
  "state": "Bihar"
 },
 {
  "ph": 7.2,
  "turbidity": 1.32,
  "temperature": 27.8,
  "tds": 184,
  "conductivity": 288,
  "dissolvedOxygen": 7.2,
  "station": "Chandpur Industrial Area, Lahartara, Varan",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.66,
  "turbidity": 3.78,
  "temperature": 25.2,
  "tds": 167,
  "conductivity": 261,
  "dissolvedOxygen": 6.4,
  "station": "Darna River At Bhagur Pumping Station Nr P",
  "state": "Maharashtra"
 },
 {
  "ph": 6.52,
  "turbidity": 3.83,
  "temperature": 19.3,
  "tds": 71,
  "conductivity": 111,
  "dissolvedOxygen": 6.5,
  "station": "Kodai Kanal Lake",
  "state": "Tamilnadu"
 },
 {
  "ph": 7.92,
  "turbidity": 2.52,
  "temperature": 27.4,
  "tds": 212,
  "conductivity": 331,
  "dissolvedOxygen": 6.7,
  "station": "Ghatprabha At W.A. Point To Gokak Town,Kar",
  "state": "Karnataka"
 },
 {
  "ph": 7.8,
  "turbidity": 1.82,
  "temperature": 24.0,
  "tds": 522,
  "conductivity": 816,
  "dissolvedOxygen": 7.8,
  "station": "Muzaffarpur",
  "state": "Bihar"
 },
 {
  "ph": 7.64,
  "turbidity": 3.46,
  "temperature": 24.0,
  "tds": 139,
  "conductivity": 218,
  "dissolvedOxygen": 7.6,
  "station": "Kamala River At Benipatti (Madhubani)",
  "state": "Bihar"
 },
 {
  "ph": 8.0,
  "turbidity": 0.81,
  "temperature": 8.0,
  "tds": 133,
  "conductivity": 208,
  "dissolvedOxygen": 9.0,
  "station": "Satluj At Nepthazakhai",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.3,
  "turbidity": 2.6,
  "temperature": 26.0,
  "tds": 431,
  "conductivity": 673,
  "dissolvedOxygen": 7.3,
  "station": "Dadu Majra",
  "state": "Chandigarh"
 },
 {
  "ph": 8.18,
  "turbidity": 3.58,
  "temperature": 24.4,
  "tds": 221,
  "conductivity": 345,
  "dissolvedOxygen": 8.4,
  "station": "Ganga At Buxar,Bihar",
  "state": "Bihar"
 },
 {
  "ph": 7.7,
  "turbidity": 2.45,
  "temperature": 26.5,
  "tds": 188,
  "conductivity": 293,
  "dissolvedOxygen": 7.7,
  "station": "Dug Well No. 2, Owned By  Group Gram Panch",
  "state": "Nan"
 },
 {
  "ph": 7.8,
  "turbidity": 0.92,
  "temperature": 27.5,
  "tds": 628,
  "conductivity": 981,
  "dissolvedOxygen": 7.8,
  "station": "Central Kolkata",
  "state": "West Bengal"
 },
 {
  "ph": 6.9,
  "turbidity": 0.7,
  "temperature": 27.0,
  "tds": 575,
  "conductivity": 898,
  "dissolvedOxygen": 6.9,
  "station": "Iffco, Phoolpur,Allahabad, U.P",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.84,
  "turbidity": 2.01,
  "temperature": 24.7,
  "tds": 231,
  "conductivity": 361,
  "dissolvedOxygen": 7.6,
  "station": "Daha At Siwam",
  "state": "Bihar"
 },
 {
  "ph": 7.96,
  "turbidity": 1.19,
  "temperature": 27.6,
  "tds": 163,
  "conductivity": 255,
  "dissolvedOxygen": 6.7,
  "station": "Bhavani At Bhavani Sagar",
  "state": "Tamilnadu"
 },
 {
  "ph": 7.5,
  "turbidity": 4.03,
  "temperature": 21.4,
  "tds": 343,
  "conductivity": 536,
  "dissolvedOxygen": 7.8,
  "station": "Katni River Near Nagar Nigam",
  "state": "Madhya Pradesh"
 },
 {
  "ph": 7.56,
  "turbidity": 3.36,
  "temperature": 29.0,
  "tds": 504,
  "conductivity": 787,
  "dissolvedOxygen": 6.9,
  "station": "Tambiraparani At Arumuganeri, Tamilnadu",
  "state": "Tamil Nadu"
 },
 {
  "ph": 7.55,
  "turbidity": 4.53,
  "temperature": 26.5,
  "tds": 321,
  "conductivity": 502,
  "dissolvedOxygen": 4.5,
  "station": "Lakshmantirtha  At D/S Of Hunsur Town",
  "state": "Karnataka"
 },
 {
  "ph": 8.09,
  "turbidity": 4.79,
  "temperature": 30.8,
  "tds": 509,
  "conductivity": 795,
  "dissolvedOxygen": 9.1,
  "station": "Krishna At Gadwal Bridge, A.P.",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 6.3,
  "turbidity": 1.59,
  "temperature": 24.0,
  "tds": 74,
  "conductivity": 115,
  "dissolvedOxygen": 6.0,
  "station": "Pumlen Lake At Tokpaching, Distt. Thoubal",
  "state": "Manipur"
 },
 {
  "ph": 7.4,
  "turbidity": 4.56,
  "temperature": 26.0,
  "tds": 474,
  "conductivity": 741,
  "dissolvedOxygen": 7.4,
  "station": "Sector 47",
  "state": "Chandigarh"
 },
 {
  "ph": 7.55,
  "turbidity": 2.27,
  "temperature": 26.1,
  "tds": 108,
  "conductivity": 169,
  "dissolvedOxygen": 7.8,
  "station": "Koel At Manoharpur After Meeting Koina Riv",
  "state": "Jharkhand"
 },
 {
  "ph": 7.7,
  "turbidity": 1.87,
  "temperature": 24.0,
  "tds": 2880,
  "conductivity": 4500,
  "dissolvedOxygen": 7.7,
  "station": "Village Vinayakia, Jodhpur (Hukum Singh Ra",
  "state": "Rajasthan"
 },
 {
  "ph": 8.13,
  "turbidity": 2.75,
  "temperature": 23.5,
  "tds": 272,
  "conductivity": 425,
  "dissolvedOxygen": 7.6,
  "station": "Ghaghra At Barhalganj, Gorakhpur",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.64,
  "turbidity": 3.21,
  "temperature": 31.1,
  "tds": 359,
  "conductivity": 561,
  "dissolvedOxygen": 6.5,
  "station": "Hiwara D/S Of Pachora, Jalgaon",
  "state": "Maharashtra"
 },
 {
  "ph": 7.91,
  "turbidity": 5.31,
  "temperature": 24.0,
  "tds": 299,
  "conductivity": 468,
  "dissolvedOxygen": 5.8,
  "station": "Ram Rekha River At Harinagar",
  "state": "Bihar"
 },
 {
  "ph": 7.91,
  "turbidity": 1.99,
  "temperature": 28.8,
  "tds": 567,
  "conductivity": 885,
  "dissolvedOxygen": 5.4,
  "station": "Ghatprabha At D/S Of Mudhol Rd. Cross Bdg.",
  "state": "Karnataka"
 },
 {
  "ph": 7.9,
  "turbidity": 4.41,
  "temperature": 25.6,
  "tds": 260,
  "conductivity": 406,
  "dissolvedOxygen": 6.6,
  "station": "Kalinadi (East) At Kannauj (Before Conf.)",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 8.0,
  "turbidity": 1.34,
  "temperature": 10.0,
  "tds": 54,
  "conductivity": 84,
  "dissolvedOxygen": 9.0,
  "station": "Parvati Before Conf. To River Beas",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.65,
  "turbidity": 9.71,
  "temperature": 26.8,
  "tds": 868,
  "conductivity": 1355,
  "dissolvedOxygen": 7.2,
  "station": "River Musi At Nagole,Rangareddy",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 8.35,
  "turbidity": 5.56,
  "temperature": 19.6,
  "tds": 499,
  "conductivity": 780,
  "dissolvedOxygen": 6.2,
  "station": "Purna Nr Achalpur-Amravati Rd Bdg, Asegaon",
  "state": "Maharashtra"
 },
 {
  "ph": 7.8,
  "turbidity": 7.82,
  "temperature": 27.6,
  "tds": 677,
  "conductivity": 1058,
  "dissolvedOxygen": 4.8,
  "station": "Yamuna At Mathura D/S",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 8.0,
  "turbidity": 4.98,
  "temperature": 11.0,
  "tds": 122,
  "conductivity": 190,
  "dissolvedOxygen": 9.7,
  "station": "Ravi At D/S Of Chamba Town",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 6.45,
  "turbidity": 2.94,
  "temperature": 28.4,
  "tds": 49,
  "conductivity": 77,
  "dissolvedOxygen": 4.5,
  "station": "R Puzhackal At Puzhackal Bridge",
  "state": "Kerala"
 },
 {
  "ph": 7.3,
  "turbidity": 1.3,
  "temperature": 30.0,
  "tds": 2688,
  "conductivity": 4200,
  "dissolvedOxygen": 7.3,
  "station": "Well Of Sh. Bhura Ram, Khetri Ngar, Jhunjh",
  "state": "Rajasthan"
 },
 {
  "ph": 8.05,
  "turbidity": 1.59,
  "temperature": 31.5,
  "tds": 725,
  "conductivity": 1133,
  "dissolvedOxygen": 8.1,
  "station": "Cauvery At Coleroon",
  "state": "Tamilnadu"
 },
 {
  "ph": 7.8,
  "turbidity": 2.68,
  "temperature": 27.0,
  "tds": 774,
  "conductivity": 1210,
  "dissolvedOxygen": 7.8,
  "station": "Indl. Estate Tarapur",
  "state": "Maharashtra "
 },
 {
  "ph": 7.25,
  "turbidity": 15.98,
  "temperature": 28.4,
  "tds": 329,
  "conductivity": 514,
  "dissolvedOxygen": 2.0,
  "station": "Matha Bhanga, Gobindapur",
  "state": "West Bengal"
 },
 {
  "ph": 8.1,
  "turbidity": 4.93,
  "temperature": 32.2,
  "tds": 722,
  "conductivity": 1129,
  "dissolvedOxygen": 5.5,
  "station": "Chandrabhaga U/S Of Pandharpur Town",
  "state": "Maharashtra"
 },
 {
  "ph": 7.96,
  "turbidity": 4.33,
  "temperature": 24.8,
  "tds": 221,
  "conductivity": 345,
  "dissolvedOxygen": 7.8,
  "station": "Ganga At Munger",
  "state": "Bihar"
 },
 {
  "ph": 7.22,
  "turbidity": 4.82,
  "temperature": 15.8,
  "tds": 60,
  "conductivity": 94,
  "dissolvedOxygen": 7.3,
  "station": "Sonai At Sonai",
  "state": "Assam"
 },
 {
  "ph": 8.03,
  "turbidity": 10.32,
  "temperature": 27.1,
  "tds": 706,
  "conductivity": 1104,
  "dissolvedOxygen": 9.7,
  "station": "Swetaganga ( Riligious Pond Of Puri City)",
  "state": "Orissa"
 },
 {
  "ph": 7.82,
  "turbidity": 4.38,
  "temperature": 23.2,
  "tds": 166,
  "conductivity": 259,
  "dissolvedOxygen": 8.3,
  "station": "At Indrapuri, Dehri On Sone",
  "state": "Bihar"
 },
 {
  "ph": 7.72,
  "turbidity": 2.36,
  "temperature": 25.2,
  "tds": 173,
  "conductivity": 271,
  "dissolvedOxygen": 5.1,
  "station": "Bridge Near Purana Bazaar",
  "state": "Nagaland"
 },
 {
  "ph": 7.85,
  "turbidity": 4.13,
  "temperature": 29.0,
  "tds": 225,
  "conductivity": 352,
  "dissolvedOxygen": 6.1,
  "station": "Tapi Nr Bardoli (Kapp Bridge) ",
  "state": "Gujarat"
 },
 {
  "ph": 8.0,
  "turbidity": 2.05,
  "temperature": 30.0,
  "tds": 464,
  "conductivity": 725,
  "dissolvedOxygen": 8.0,
  "station": "Well At India Public School, Manpur Macher",
  "state": "Rajasthan"
 },
 {
  "ph": 7.4,
  "turbidity": 0.56,
  "temperature": 29.0,
  "tds": 925,
  "conductivity": 1445,
  "dissolvedOxygen": 7.4,
  "station": "Phed Well Near Nei, Khatipura",
  "state": "Rajasthan"
 },
 {
  "ph": 6.75,
  "turbidity": 1.75,
  "temperature": 25.9,
  "tds": 37,
  "conductivity": 58,
  "dissolvedOxygen": 6.5,
  "station": "R Thallassery At Pathippalam",
  "state": "Kerala"
 },
 {
  "ph": 8.5,
  "turbidity": 2.35,
  "temperature": 22.0,
  "tds": 316,
  "conductivity": 493,
  "dissolvedOxygen": 8.6,
  "station": "Gaya-",
  "state": "Bihar"
 },
 {
  "ph": 7.7,
  "turbidity": 2.53,
  "temperature": 24.0,
  "tds": 341,
  "conductivity": 533,
  "dissolvedOxygen": 7.7,
  "station": "Siwam",
  "state": "Bihar"
 },
 {
  "ph": 8.01,
  "turbidity": 2.08,
  "temperature": 16.6,
  "tds": 93,
  "conductivity": 145,
  "dissolvedOxygen": 9.6,
  "station": "Alkananda B/C Mandakini At Rudra Prayag",
  "state": "Uttarakhand"
 },
 {
  "ph": 7.34,
  "turbidity": 2.51,
  "temperature": 22.3,
  "tds": 56,
  "conductivity": 88,
  "dissolvedOxygen": 8.1,
  "station": "Mahananda D/S, Ramghat",
  "state": "West Bengal"
 },
 {
  "ph": 7.6,
  "turbidity": 1.34,
  "temperature": 30.7,
  "tds": 1041,
  "conductivity": 1627,
  "dissolvedOxygen": 7.6,
  "station": "Riico Tube Well, Ria, Behror",
  "state": "Rajasthan"
 },
 {
  "ph": 6.79,
  "turbidity": 4.59,
  "temperature": 27.4,
  "tds": 39,
  "conductivity": 61,
  "dissolvedOxygen": 5.2,
  "station": "R Periyar At Kalamassery",
  "state": "Kerala"
 },
 {
  "ph": 8.0,
  "turbidity": 1.55,
  "temperature": 24.0,
  "tds": 456,
  "conductivity": 712,
  "dissolvedOxygen": 6.0,
  "station": "Lake Rajsamand, Rajsamand- Point No. 2, Ra",
  "state": "Rajasthan"
 },
 {
  "ph": 7.45,
  "turbidity": 2.76,
  "temperature": 21.5,
  "tds": 70,
  "conductivity": 110,
  "dissolvedOxygen": 8.3,
  "station": "Panchnai At Nh-52 Crossing, Orang",
  "state": "Assam"
 },
 {
  "ph": 8.1,
  "turbidity": 4.11,
  "temperature": 21.0,
  "tds": 1056,
  "conductivity": 1650,
  "dissolvedOxygen": 8.1,
  "station": "Koradi, Nagpur",
  "state": "Maharashtra "
 },
 {
  "ph": 7.95,
  "turbidity": 3.39,
  "temperature": 18.2,
  "tds": 354,
  "conductivity": 554,
  "dissolvedOxygen": 5.8,
  "station": "Wardha At Rajura Bridge",
  "state": "Maharashtra"
 },
 {
  "ph": 8.22,
  "turbidity": 2.13,
  "temperature": 22.7,
  "tds": 212,
  "conductivity": 331,
  "dissolvedOxygen": 7.9,
  "station": "Sikrana At Chanpatiya",
  "state": "Bihar"
 },
 {
  "ph": 7.5,
  "turbidity": 2.01,
  "temperature": 23.0,
  "tds": 1187,
  "conductivity": 1855,
  "dissolvedOxygen": 7.5,
  "station": "Near Uit Bridge, Udaipur",
  "state": "Rajasthan"
 },
 {
  "ph": 8.0,
  "turbidity": 1.67,
  "temperature": 29.0,
  "tds": 1301,
  "conductivity": 2033,
  "dissolvedOxygen": 8.0,
  "station": "Gabheni Vill, Surat (Industrial)",
  "state": "Gujarat"
 },
 {
  "ph": 7.47,
  "turbidity": 3.75,
  "temperature": 26.2,
  "tds": 442,
  "conductivity": 691,
  "dissolvedOxygen": 8.8,
  "station": "Kaliasot Nr Rd Bdg, Mandideep",
  "state": "Madhya Pradesh"
 },
 {
  "ph": 7.82,
  "turbidity": 2.21,
  "temperature": 27.0,
  "tds": 184,
  "conductivity": 287,
  "dissolvedOxygen": 7.7,
  "station": "Ganga At Palta ",
  "state": "West Bengal"
 },
 {
  "ph": 7.7,
  "turbidity": 1.99,
  "temperature": 24.0,
  "tds": 408,
  "conductivity": 637,
  "dissolvedOxygen": 7.7,
  "station": "Munger",
  "state": "Bihar"
 },
 {
  "ph": 6.62,
  "turbidity": 1.72,
  "temperature": 26.8,
  "tds": 67,
  "conductivity": 104,
  "dissolvedOxygen": 7.0,
  "station": "Manimala At Thondra, Kerala",
  "state": "Kerala"
 },
 {
  "ph": 8.09,
  "turbidity": 3.53,
  "temperature": 27.3,
  "tds": 491,
  "conductivity": 767,
  "dissolvedOxygen": 4.4,
  "station": "Nira At D/S Of Jubilant Organosis, Pune.",
  "state": "Maharashtra"
 },
 {
  "ph": 6.6,
  "turbidity": 0.76,
  "temperature": 28.0,
  "tds": 294,
  "conductivity": 459,
  "dissolvedOxygen": 6.6,
  "station": "Ground Water Point Near Burdwan Station",
  "state": "West Bengal"
 },
 {
  "ph": 8.0,
  "turbidity": 3.25,
  "temperature": 15.0,
  "tds": 101,
  "conductivity": 158,
  "dissolvedOxygen": 9.0,
  "station": "Ravi At At Chamera Reservoir",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 8.04,
  "turbidity": 2.96,
  "temperature": 28.9,
  "tds": 130,
  "conductivity": 203,
  "dissolvedOxygen": 6.4,
  "station": "Rudrasagar, Sonumura",
  "state": "Tripura"
 },
 {
  "ph": 8.16,
  "turbidity": 2.13,
  "temperature": 23.5,
  "tds": 237,
  "conductivity": 370,
  "dissolvedOxygen": 7.7,
  "station": "Rapti A/C R. Honin Nr. Domingarh Rly Bdg, ",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 5.9,
  "turbidity": 1.4,
  "temperature": 29.0,
  "tds": 124,
  "conductivity": 194,
  "dissolvedOxygen": 5.8,
  "station": "Well At Kudai Indl. Estate(M/S Cadila Heal",
  "state": "Goa"
 },
 {
  "ph": 7.3,
  "turbidity": 1.51,
  "temperature": 21.0,
  "tds": 1054,
  "conductivity": 1647,
  "dissolvedOxygen": 7.3,
  "station": "Sahibabad Industrial Area, Ghaziabad, U.P",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.63,
  "turbidity": 11.26,
  "temperature": 26.2,
  "tds": 981,
  "conductivity": 1532,
  "dissolvedOxygen": 7.2,
  "station": "Kalinadi (East) At U/S Of Gulaothi Town In",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.0,
  "turbidity": 1.3,
  "temperature": 32.5,
  "tds": 300,
  "conductivity": 469,
  "dissolvedOxygen": 7.0,
  "station": "Visva Bharati",
  "state": "West Bengal"
 },
 {
  "ph": 7.67,
  "turbidity": 2.72,
  "temperature": 25.8,
  "tds": 267,
  "conductivity": 417,
  "dissolvedOxygen": 5.7,
  "station": "Girna At Malegaon (Manmad)",
  "state": "Maharashtra"
 },
 {
  "ph": 7.81,
  "turbidity": 3.65,
  "temperature": 29.8,
  "tds": 468,
  "conductivity": 732,
  "dissolvedOxygen": 6.1,
  "station": "Palleru Before Confl. With Krishna, Jaggay",
  "state": "Andhra Pradesh"
 },
 {
  "ph": 6.47,
  "turbidity": 2.51,
  "temperature": 28.7,
  "tds": 30,
  "conductivity": 46,
  "dissolvedOxygen": 6.8,
  "station": "Zuari At D/S Of Pt. Where Kumbarjria Canal",
  "state": "Goa"
 },
 {
  "ph": 8.0,
  "turbidity": 1.95,
  "temperature": 23.0,
  "tds": 964,
  "conductivity": 1507,
  "dissolvedOxygen": 8.0,
  "station": "Parvati Indl. Estate, Shirol",
  "state": "Maharashtra "
 },
 {
  "ph": 8.32,
  "turbidity": 2.27,
  "temperature": 22.9,
  "tds": 370,
  "conductivity": 578,
  "dissolvedOxygen": 6.0,
  "station": "Fateh Sagar Lake At Udaipur Intake Point O",
  "state": "Rajasthan"
 },
 {
  "ph": 8.14,
  "turbidity": 4.21,
  "temperature": 27.3,
  "tds": 682,
  "conductivity": 1066,
  "dissolvedOxygen": 6.5,
  "station": "Bhima At D/S Of Road Bridge At Gangapur Vi",
  "state": "Karnataka"
 },
 {
  "ph": 7.32,
  "turbidity": 3.86,
  "temperature": 23.5,
  "tds": 267,
  "conductivity": 417,
  "dissolvedOxygen": 7.8,
  "station": "Subarnarekha At Gatalsud Dam",
  "state": "Jharkhand"
 },
 {
  "ph": 7.66,
  "turbidity": 1.86,
  "temperature": 25.2,
  "tds": 56,
  "conductivity": 87,
  "dissolvedOxygen": 7.2,
  "station": "Tambiraparani At Pappankulam,Tamilnadu",
  "state": "Tamil Nadu"
 },
 {
  "ph": 7.05,
  "turbidity": 2.5,
  "temperature": 26.5,
  "tds": 33,
  "conductivity": 52,
  "dissolvedOxygen": 7.2,
  "station": "Kallada At Perumthottam Kadavu, Punaloor, ",
  "state": "Kerala"
 },
 {
  "ph": 7.79,
  "turbidity": 3.17,
  "temperature": 20.4,
  "tds": 90,
  "conductivity": 141,
  "dissolvedOxygen": 5.6,
  "station": "Venna At Mahabaleshwar, Satara",
  "state": "Maharashtra"
 },
 {
  "ph": 8.12,
  "turbidity": 4.07,
  "temperature": 26.3,
  "tds": 427,
  "conductivity": 667,
  "dissolvedOxygen": 6.5,
  "station": "Kagina D/S Of Sewage Disposal Point",
  "state": "Karnataka"
 },
 {
  "ph": 7.0,
  "turbidity": 1.3,
  "temperature": 26.0,
  "tds": 902,
  "conductivity": 1409,
  "dissolvedOxygen": 7.0,
  "station": "Hand Pump At Kala Amb",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.98,
  "turbidity": 6.19,
  "temperature": 22.8,
  "tds": 174,
  "conductivity": 272,
  "dissolvedOxygen": 7.1,
  "station": "At Varanasi D/S (Malviya Bridge)",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.72,
  "turbidity": 3.11,
  "temperature": 23.0,
  "tds": 157,
  "conductivity": 246,
  "dissolvedOxygen": 7.4,
  "station": "Sai At Jalalpur, Jaunpur",
  "state": "Uttar Pradesh"
 },
 {
  "ph": 7.89,
  "turbidity": 2.9,
  "temperature": 24.7,
  "tds": 238,
  "conductivity": 372,
  "dissolvedOxygen": 7.5,
  "station": "Yamuna At Kalanaur,  Yamuna Nagar",
  "state": "Haryana"
 },
 {
  "ph": 7.81,
  "turbidity": 1.55,
  "temperature": 20.6,
  "tds": 174,
  "conductivity": 273,
  "dissolvedOxygen": 9.1,
  "station": "Yamuna At Hathnikund ",
  "state": "Haryana"
 },
 {
  "ph": 7.8,
  "turbidity": 3.53,
  "temperature": 27.2,
  "tds": 120,
  "conductivity": 188,
  "dissolvedOxygen": 7.8,
  "station": "Shibnagar, Agartala, Tripura",
  "state": "Tripura"
 },
 {
  "ph": 6.2,
  "turbidity": 2.53,
  "temperature": 30.5,
  "tds": 164,
  "conductivity": 256,
  "dissolvedOxygen": 6.2,
  "station": "Well At Pilerne Indl Estate (M/S Unichem )",
  "state": "Goa"
 },
 {
  "ph": 7.73,
  "turbidity": 4.01,
  "temperature": 25.8,
  "tds": 129,
  "conductivity": 202,
  "dissolvedOxygen": 6.0,
  "station": "Pawana At Ravet Weir, Ravet, Haweli, Pune",
  "state": "Maharashtra"
 },
 {
  "ph": 7.3,
  "turbidity": 1.64,
  "temperature": 30.0,
  "tds": 2099,
  "conductivity": 3280,
  "dissolvedOxygen": 7.3,
  "station": "Riico Tube Well, Ria, Shahjahanpur",
  "state": "Rajasthan"
 },
 {
  "ph": 8.5,
  "turbidity": 5.53,
  "temperature": 9.0,
  "tds": 156,
  "conductivity": 244,
  "dissolvedOxygen": 8.9,
  "station": "Hand Pump At Recongpeo",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 7.42,
  "turbidity": 1.65,
  "temperature": 26.4,
  "tds": 98,
  "conductivity": 153,
  "dissolvedOxygen": 7.3,
  "station": "Brahmaputra At Chandrapur",
  "state": "Assam"
 },
 {
  "ph": 7.86,
  "turbidity": 5.33,
  "temperature": 27.0,
  "tds": 544,
  "conductivity": 849,
  "dissolvedOxygen": 7.6,
  "station": "Moti Jheel At Motiharii",
  "state": "Bihar"
 },
 {
  "ph": 7.86,
  "turbidity": 3.22,
  "temperature": 23.0,
  "tds": 346,
  "conductivity": 541,
  "dissolvedOxygen": 5.3,
  "station": "Wainganga D/S Of Ellora Paper Mill.",
  "state": "Maharashtra"
 },
 {
  "ph": 8.0,
  "turbidity": 1.44,
  "temperature": 10.0,
  "tds": 88,
  "conductivity": 137,
  "dissolvedOxygen": 9.0,
  "station": "Ravi At At D/S Chamera Iii Hep",
  "state": "Himachal Pradesh"
 },
 {
  "ph": 8.1,
  "turbidity": 3.07,
  "temperature": 26.0,
  "tds": 1347,
  "conductivity": 2104,
  "dissolvedOxygen": 8.1,
  "station": "Mira-Bhayander",
  "state": "Maharashtra "
 },
 {
  "ph": 7.0,
  "turbidity": 3.31,
  "temperature": 14.0,
  "tds": 203,
  "conductivity": 317,
  "dissolvedOxygen": 7.0,
  "station": "Beas At G.T.Road Under Bdg. Near Kapurthal",
  "state": " Punjab"
 }
];
