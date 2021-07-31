export default [
  {
    path: '/singer',
    component: () => import('@/page/home/Singer'),
    meta: {
      home: true,
    },
  },
  {
    path: '/singer/detail',
    component: () => import('@/page/singer/SingerDetail'),
  },
];
