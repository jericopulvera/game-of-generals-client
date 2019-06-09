export default {
  page: 1,
  golfCourses: [],
  date: null,
  golfCourse: null,
  holes: '9',
  playerCount: 1,
  selectedTeeTime: null,
  addOns: [],
  totalAddOns: 0,
  loadingPayment: false,

  players: [],
  // playerType: null,
  playerTypes: [
    { name: 'PRH', slug: 'prh' },
    { name: 'PRH Spouse', slug: 'prh-spouse' },
    { name: 'PRH Dependent', slug: 'prh-dependent' },
    { name: 'APP', slug: 'app' },
    { name: 'Guest', slug: 'guest' },
  ],

  dbAddOns: [
    {
      _id: 1,
      name: 'Driving Range Bucket of Ball',
      rate: 500,
    },
    {
      _id: 2,
      name: 'Pushcart',
      rate: 500,
    },
    {
      _id: 3,
      name: 'Golf cart 2 Seater',
      rate: 3000,
    },
    {
      _id: 4,
      name: 'Golf cart 4 Seater',
      rate: 4000,
    },
  ],
};
