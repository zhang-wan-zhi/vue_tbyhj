import Mock from 'mockjs'

// 登录
export function login () {
  return {
    // isOpen: false,
    url: '/sys/login',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'expire': Mock.Random.natural(60 * 60 * 1, 60 * 60 * 12),
      'token': Mock.Random.string('ca427eb25ae14166b49e27aa6a40ddc', 32)
    }
  }
}

// 退出
export function logout () {
  return {
    // isOpen: false,
    url: '/user/logout',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
