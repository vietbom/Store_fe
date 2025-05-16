import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Truck, User } from 'lucide-react'
import { useAuthStore } from '../../apis/Auth'
import { useReceiptStore } from '../../apis/Receipt'
interface ProductItem {
  product: {
    MaSP: string
    productName: string
    price: number
    image?: string
  }
  soLuong: number
}


const Payment = () => {
    const location = useLocation()
    const selectedItems: ProductItem[] = location.state?.selectedItems || []
    const navigate = useNavigate()

    const { user } = useAuthStore()
    const {createReceipt} = useReceiptStore()
    const [orderCode, setOrderCode] = useState('')
    //dia chi 
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')
    const [detailAddress, setDetailAddress] = useState('')
    const address = [detailAddress, ward, district, province]
        .filter(part => part && part.trim() !== '')
        .join(', ') 
    const [note, setNote] = useState('')
    useEffect(() => {
        const generateOrdercode = () => {
            const timestamp = Date.now()
                return `DH${timestamp}`
            }
            setOrderCode(generateOrdercode)
        }, []
    )
    
    const [selectMethod, setSelectedMethod] = useState('COD')
    const methodPayments = [
        {key: 'COD', label:'Thanh toán khi nhận hàng (COD)'},
        {key: 'BANK', label:'Chuyển khoản ngân hàng (BANK)'},
        {key: 'CREDICARD', label:'Thẻ tín dụng/Thẻ ghi nợ '}
    ]
    useEffect(() => {
        console.log('Dữ liệu selectedItems nhận được từ state:', selectedItems)
        }, [selectedItems])

    // Tính tổng đơn hàng
    const subtotal = selectedItems.reduce((sum: number, item: ProductItem) => {
        const price = Number(item.product.price) || 0
        const quantity = Number(item.soLuong) || 0
        return sum + price * quantity
        }, 0)


    const handleSubmit = async () => {
        if (!orderCode.trim()) {
            alert("Vui lòng nhập mã đơn hàng.")
            return
        }

        try {
            const payload = {
                MaDH: orderCode,
                MaKH: user?.MaKH!,
                products: selectedItems.map(item => ({
                    MaSP: item.product.MaSP,
                    SoLuong: item.soLuong
                })),
                dateOrder: new Date().toISOString(),
                voucher: '',
                paymentStatus: selectMethod,
                address: address,
                note: note,
                priceTotal: subtotal,
            }

            await createReceipt(payload)
            alert("Đơn hàng đã được tạo thành công!")
            navigate('/user/receipt')
        } catch (error) {
            alert("Có lỗi xảy ra khi tạo đơn hàng.")
        }
    }
    return (
        <div className='container mx-auto py-6 px-4 md:px-6'>
        <h1 className='text-2xl font-bold mb-6'>Thanh toán hóa đơn</h1>

        <div className='grid gap-6 lg:grid-cols-3'>
            <div className='lg:col-span-2 space-y-6'>
            <div className='bg-gray-100 p-4 rounded flex items-center gap-2 font-medium'>
                <User className='h-5 w-5' />
                Thông tin khách hàng
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                    <label htmlFor='MaDH' className='block font-medium'>Mã đơn hàng:</label>
                    <input 
                        id='MaDH' className='w-full border rounded px-3 py-2'
                        value={orderCode}
                        readOnly
                    /> 
                </div>
                <div className='space-y-1'>
                    <label htmlFor='userName' className='block font-medium'>Họ và tên:</label>
                    <input 
                        id='userName' className='w-full border rounded px-3 py-2'
                        value={user?.userName || ''}
                        readOnly
                    /> 
                </div>
                <div className='space-y-1'>
                <label htmlFor='SDT' className='block font-medium'>Số điện thoại:</label>
                <input 
                        id='SDT' className='w-full border rounded px-3 py-2' 
                        value={user?.SDT || ''}
                        readOnly
                    />
                </div>
                <div className='space-y-1 md:col-span-2'>
                <label htmlFor='email' className='block font-medium'>Email:</label>
                <input 
                    id='email' className='w-full border rounded px-3 py-2' 
                    value={user?.email || ''}
                    readOnly
                />
                </div>
            </div>

            <div className='bg-gray-100 p-4 rounded flex items-center gap-2 font-medium'>
                <Truck className='h-5 w-5' />
                Địa chỉ giao hàng
            </div>

            <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-1'>
                    <label htmlFor='province' className='block font-medium'>Tỉnh/Thành phố</label>
                    <input id='province' className='w-full border rounded px-3 py-2' placeholder='Hà Nội' value={province} onChange={(e) => setProvince(e.target.value)}/>
                </div>
                <div className='space-y-1'>
                    <label htmlFor='district' className='block font-medium'>Quận/Huyện</label>
                    <input id='district' className='w-full border rounded px-3 py-2' placeholder='Cầu Giấy' value={district} onChange={(e) => setDistrict(e.target.value)} />
                </div>
                <div className='space-y-1'>
                    <label htmlFor='ward' className='block font-medium'>Phường/Xã</label>
                    <input id='ward' className='w-full border rounded px-3 py-2' placeholder='Dịch Vọng' value={ward} onChange={(e) => setWard(e.target.value)} />
                </div>
                </div>
                <div className='space-y-1'>
                <label htmlFor='address' className='block font-medium'>Địa chỉ cụ thể</label>
                <input id='address' className='w-full border rounded px-3 py-2' placeholder='Số nhà, tên đường...' value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)}/>
                </div>
                <div>
                    <h2>Thông tin địa chỉ:</h2>
                    <p>{address}</p>
                </div>
                <div className='space-y-1'>
                <label htmlFor='note' className='block font-medium'>Ghi chú</label>
                <input  
                    id='note' 
                    className='w-full border rounded px-3 py-2' 
                    placeholder='Chỉ dẫn cụ thể...'
                    value={note}
                    onChange={(e) => setNote(e.target.value)}/>
                </div>
            </div>

            <div >
                <p className='bg-gray-100 p-4 rounded flex items-center gap-2 font-medium'>Phương thức thanh toán</p>
                <div className='mt-2 flex space-x-2'>
                    {methodPayments.map(method => (
                        <button
                            key={method.key}
                            onClick={() => setSelectedMethod(method.key)}
                            className={`px-4 py-2 rounded border ${
                            selectMethod === method.key
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {method.label}
                        </button>
                    ))}
                </div>
                <div className='mt-4 p-4 border rounded bg-gray-50'>
                    {selectMethod === 'COD' && <p>Bạn đã chọn: Thanh toán khi nhận hàng (COD).</p>}
                    {selectMethod === 'BANK' && <p>Xin lỗi vì sự bất tiện này, chức năng này hệ thống chưa hoàn thiện.</p>}
                    {selectMethod === 'CREDICARD' && <p>Xin lỗi vì sự bất tiện này, chức năng này hệ thống chưa hoàn thiện</p>}
                </div>
            </div>
            </div>

            {/* ĐƠN HÀNG */}
            <div className='bg-white border rounded-lg p-6 space-y-4 shadow'>
            <h2 className='text-lg font-semibold mb-2'>Đơn hàng của bạn</h2>

            {selectedItems.map((item: any) => (
                <div key={item.product._id} className='flex gap-4 border-b pb-4'>
                <img
                    src={item.product.image || '/placeholder.png'}
                    alt={item.product.productName}
                    className='w-16 h-16 object-cover rounded border'
                />
                <div className='flex-1'>
                    <h3 className='font-medium'>{item.product.productName}</h3>
                    <p className='text-sm text-gray-500'>Mã SP: {item.product.MaSP}</p>
                    <div className='flex justify-between text-sm mt-1'>
                    <p>Số lượng: {item.soLuong}</p>
                    <p className='text-green-600 font-semibold'>
                        {(item.product.price * item.soLuong).toLocaleString('vi-VN')}đ
                    </p>
                    </div>
                </div>
                </div>
            ))}

            <div className='pt-4 border-t space-y-2 text-sm'>
                <div className='flex justify-between'>
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className='flex justify-between'>
                <span>Phí vận chuyển</span>
                <span>0đ</span>
                </div>
                <div className='flex justify-between font-semibold text-base'>
                <span>Tổng cộng</span>
                <span className='text-green-600'>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            <button 
                onClick={handleSubmit}
                className='w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700'>
                Hoàn tất đặt hàng
            </button>
            </div>
        </div>
        </div>
    )
}

export default Payment
