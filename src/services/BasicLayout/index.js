import axios from '@/utils/axios'

// 获取左侧菜单
export function getMenu(params) {
  return axios.post('/web/easyaction/user/queryMenu', params);
  return [
    {
      path: '/project/:id',
      name: '控制台',
      icon: 'fund'
    },
    {
      path: '/overall/:id',
      name: '统筹',
      icon: 'fund',
      children: [
        {
          path: '/overall/:id/sence',
          name: '顺场表',
          exact: true
        },
        {
          path: '/overall/:id/plan',
          name: '大计划',
          exact: true
        },
        {
          path: '/overall/:id/announce',
          name: '通告',
          exact: true
        },
        {
          path: '/overall/:id/spectacle',
          name: '场景',
          exact: true
        },
        {
          path: '/overall/:id/role',
          name: '角色',
          exact: true
        },
        {
          path: '/overall/:id/location',
          name: '实拍地',
          exact: true
        },
        {
          path: '/overall/:id/performer',
          name: '演员',
          exact: true
        },
      ],
    },
  ]
}