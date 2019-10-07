export default [
    {
        path: '/album',
        component: () => import('@/page/album/Album'),
    },
    {
        path: '/album/detail',
        component: () => import('@/page/album/AlbumDetail'),
    },
    {
        path: '/album/comment',
        component: () => import('@/page/album/AlbumComment')
    },
];
