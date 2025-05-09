import { AlertCircle, Eye, EyeOff, Lock, Mail, NfcIcon, Phone, User } from 'lucide-react'
import React, { use, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../lib/axios'

const SignUp = () => {
    const [showPsw, setShowPsw] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        MaKH: '',
        email: '',
        userName: '',
        password: '',
        typeCs: '',
        SDT: '',
    })
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(error ) setError(null)
        setFormData({...formData, [e.currentTarget.name]: e.currentTarget.value})
    }
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await axiosInstance.post('user/signUp', formData)
            if(response.status === 201){
                navigate('/login')
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại!' )
        }
    }
    const customerTypes = [
        {value: '' , label: 'Loại khách hàng (tùy chọn)'},
        {value: 'Student', label: 'Học sinh - Sinh viên'},
        {value: 'Member', label: 'DucViet member'},
        {value: 'B2B', label: 'Khách hành doanh nghiệp B2B '},
        {value: 'Other', label: 'Khác'},
    ]

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
            <h2 className='mt-6 text-center text-3xl font-semibold text-gray-900'>
            Đăng ký tài khoản
            </h2>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            {error && (
                <div className='flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded'>
                    <AlertCircle size={20}/>
                    <span>{error}</span>
                </div>
            )}

            <div className='rounded-md shadow-sm space-y-4'>
                <div className='relative'>
                    <label htmlFor="MaKH" className="sr-only">
                    Mã khách hàng
                    </label>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
                    <input
                        id='MaKH'
                        name='MaKH'
                        type='text'
                        required
                        value={formData.MaKH}
                        onChange={handleChange}
                        className='appearance-none rounded block w-full px-12 py-2 border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm'
                        placeholder='Mã khách hàng'
                    />
                </div>

                <div className='relative'>
                    <label htmlFor="email" className="sr-only">
                    Email
                    </label>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
                    <input
                        id='email'
                        name='email'
                        type='text'
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className='appearance-none rounded block w-full px-12 py-2 border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm'
                        placeholder='Email'
                    />
                </div>

                <div className='relative'>
                    <label htmlFor="userName" className="sr-only">
                    Tên người dùng
                    </label>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
                    <input
                        id='userName'
                        name='userName'
                        type='text'
                        required
                        value={formData.userName}
                        onChange={handleChange}
                        className='appearance-none rounded block w-full px-12 py-2 border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm'
                        placeholder='Tên người dùng'
                    />
                </div>

                <div className='relative'>
                    <label htmlFor="password" className="sr-only">
                    Mật khẩu
                    </label>
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
                    <input
                        id='password'
                        name='password'
                        type={showPsw ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className='appearance-none rounded block w-full px-12 py-2 border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm'
                        placeholder='Mật khẩu'
                    />
                    <button
                        type='button'
                        onClick={() => setShowPsw(!showPsw)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    >
                        {showPsw ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                </div>

                <div className='relative'>
                    <label htmlFor="typeCs" className="sr-only">
                    Loại khách hàng
                    </label>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
                    <select
                        id='typeCs'
                        name='typeCs'
                        required
                        value={formData.typeCs}
                        onChange={handleChange}
                        className='appearance-none rounded block w-full px-12 py-2 border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm'
                    >
                        {customerTypes.map((typeOption) => (
                            <option key={typeOption.value} value={typeOption.value}>
                                {typeOption.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='relative'>
                    <label htmlFor="SDT" className="sr-only">
                    Số điện thoại
                    </label>
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
                    <input
                        id='SDT'
                        name='SDT'
                        type='text'
                        required
                        value={formData.SDT}
                        onChange={handleChange}
                        className='appearance-none rounded block w-full px-12 py-2 border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm'
                        placeholder='Số điện thoại'
                    />
                </div>

            </div>
            
            <div>
                <button
                    type='submit'
                    className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 '
                >
                    Đăng ký
                </button>
            </div>

            <div className='text-center'>
                <button
                    type='submit'
                    onClick={() => navigate('/login')}
                    className='font-medium text-indigo-600 hover:text-indigo-600'
                >
                    Đã có tài khoản? Đăng nhập
                </button>
            </div>

        </form>
      </div>

    </div>
  )
}

export default SignUp
