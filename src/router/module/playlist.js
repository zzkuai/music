export default [
    {
        path: '/playlist',
        component: () => import('@/page/playlist/PlayList')
    },
    {
        path: '/playlist/tag',
        component: () => import('@/page/playlist/PlayListTag')
    },
    {
        path: '/playlist/category',
        component: () => import('@/page/playlist/PlayListCategory')
    },
    {
        path: '/playlist/detail',
        component: () => import('@/page/playlist/PlayListDetail')
    },
    {
        path: '/playlist/comment',
        component: () => import('@/page/playlist/PlayListComment')
    },
];
