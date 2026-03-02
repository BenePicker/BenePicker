import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin } from '../../api/member/useMember'

export default function Login() {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()

  const [form, setForm] = useState({ memberEmail: '', memberPw: '' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login(form, {
      onSuccess: () => navigate('/'),
      onError: (err) => alert(err.response?.data?.message || '로그인 실패'),
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input
            type="email"
            name="memberEmail"
            value={form.memberEmail}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">비밀번호</label>
          <input
            type="password"
            name="memberPw"
            value={form.memberPw}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error.response?.data?.message || '로그인 실패'}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isPending ? '로그인 중...' : '로그인'}
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  )
}
