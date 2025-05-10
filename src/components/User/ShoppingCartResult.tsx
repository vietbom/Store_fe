import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../apis/User'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../apis/Auth'

const ShoppingCartResult = () => {
    const { cart, isLoadingCart, getCart, updateCartItem, removeFromCart, clearCart } = useUserStore()
    const { user, isAuthenticated } = useAuthStore()
    const [total, setTotal] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCart = async () => {
            try {
                console.log('Auth state:', { user, isAuthenticated });
                if (!isAuthenticated) {
                    console.log('User not authenticated');
                    return;
                }
                if (!user?.MaKH) {
                    console.log('No MaKH available');
                    return;
                }
                
                console.log('Fetching cart for user:', user.MaKH);
                const cartData = await getCart(user.MaKH);
                if (!cartData) {
                    console.log('No cart data received');
                    setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
                setError('Đã xảy ra lỗi khi tải giỏ hàng');
            }
        };

        fetchCart();
    }, [user, isAuthenticated, getCart]);

    useEffect(() => {
        console.log('Cart state:', cart);
        if (cart) {
            const newTotal = cart.products.reduce((sum, item) => {
                return sum + (item.product.price * item.soLuong)
            }, 0)
            setTotal(newTotal)
        }
    }, [cart])

    const handleUpdateQuantity = async (MaSP: string, currentSoLuong: number, increment: boolean) => {
        try {
            const newSoLuong = increment ? currentSoLuong + 1 : currentSoLuong - 1;
            if (newSoLuong >= 0) {
                console.log('Updating quantity:', { MaSP, currentSoLuong, newSoLuong });
                const updatedCart = await updateCartItem(MaSP, newSoLuong);
                
                if (!updatedCart) {
                    console.error('Failed to update cart item');
                    setError('Không thể cập nhật số lượng. Vui lòng thử lại sau.');
                    return;
                }

                // No need to refresh cart as updateCartItem already updates the state
                console.log('Cart updated successfully');
            }
        } catch (err) {
            console.error('Error updating quantity:', err);
            setError('Đã xảy ra lỗi khi cập nhật số lượng. Vui lòng thử lại sau.');
        }
    }

    const handleRemoveItem = async (MaSP: string) => {
        try {
            console.log('Removing item from cart:', MaSP);
            const updatedCart = await removeFromCart(MaSP);
            
            if (!updatedCart) {
                console.error('Failed to remove item from cart');
                setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
                return;
            }

            console.log('Item removed successfully');
        } catch (err) {
            console.error('Error removing item:', err);
            setError('Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại sau.');
        }
    }

    const handleClearCart = async () => {
        try {
            console.log('Starting clear cart process...');
            const success = await clearCart();
            console.log('Clear cart result:', success);
            
            if (success) {
                // Refresh cart after clearing
                if (user?.MaKH) {
                    console.log('Refreshing cart for user:', user.MaKH);
                    await getCart(user.MaKH);
                }
            } else {
                console.error('Clear cart failed');
                setError('Không thể xóa giỏ hàng. Vui lòng thử lại sau.');
            }
        } catch (err) {
            console.error('Error in handleClearCart:', err);
            setError('Đã xảy ra lỗi khi xóa giỏ hàng. Vui lòng thử lại sau.');
        }
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">{error}</h2>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Vui lòng đăng nhập để xem giỏ hàng</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        )
    }

    if (isLoadingCart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!cart || cart.products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Danh sách sản phẩm */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {cart.products.map((item) => (
                                <div key={item.product._id} className="p-6 flex items-center">
                                    {/* Hình ảnh sản phẩm */}
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img
                                            src={item.product.image || '/placeholder.png'}
                                            alt={item.product.productName}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="ml-6 flex-1">
                                        <h3 className="text-lg font-semibold">{item.product.productName}</h3>
                                        <p className="text-gray-600">Mã SP: {item.product.MaSP}</p>
                                        <p className="text-lg font-semibold text-green-600">
                                            {item.product.price.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>

                                    {/* Số lượng */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product.MaSP, item.soLuong, false)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="w-12 text-center">{item.soLuong}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product.MaSP, item.soLuong, true)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    {/* Tổng tiền cho sản phẩm */}
                                    <div className="ml-6 text-right">
                                        <p className="text-lg font-semibold">
                                            {(item.product.price * item.soLuong).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>

                                    {/* Nút xóa */}
                                    <button
                                        onClick={() => handleRemoveItem(item.product.MaSP)}
                                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nút xóa giỏ hàng */}
                    <div className="mt-4">
                        <button
                            onClick={handleClearCart}
                            className="text-red-500 hover:text-red-600 font-medium"
                        >
                            Xóa giỏ hàng
                        </button>
                    </div>
                </div>

                {/* Tổng đơn hàng */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Tạm tính</span>
                                <span>{total.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>0đ</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Tổng cộng</span>
                                    <span className="text-green-600">{total.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            Tiến hành thanh toán
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="w-full mt-4 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCartResult
