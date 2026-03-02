import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSignup } from '../../api/member/useMember'

export default function Signup() {
  const navigate = useNavigate()
  const { mutate: signup, isPending } = useSignup()

  const [form, setForm] = useState({
    memberEmail: '',
    memberPw: '',
    memberNickname: '',
    memberTel: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(form, {
      onSuccess: () => {
        alert('회원가입 완료!')
        navigate('/login')
      },
      onError: (err) => alert(err.response?.data?.message || '회원가입 실패'),
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        {[
          { label: '이메일', name: 'memberEmail', type: 'email' },
          { label: '비밀번호', name: 'memberPw', type: 'password' },
          { label: '닉네임', name: 'memberNickname', type: 'text' },
          { label: '전화번호', name: 'memberTel', type: 'tel' },
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition mt-2"
        >
          {isPending ? '처리 중...' : '회원가입'}
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </div>
  )
}
