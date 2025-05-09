import ShoppingCart from '../model/cart/shoppingCart.js'
import Customer from '../model/user.model/Customers.js'
import Product from '../model/product.model/Products.js'

export const addProductToCart = async(req, res) => {
    const { MaSP, MaKH } = req.body
    const soLuong = parseInt(req.body.soLuong) || 1
    try {
        if (!MaSP || !MaKH) {
            return res.status(400).json({ message: "MaSP và MaKH là bắt buộc" })
        }

        if (soLuong <= 0) {
            return res.status(400).json({ message: "Số lượng phải lớn hơn 0" })
        }

        const customer = await Customer.findOne({ MaKH })
        const product = await Product.findOne({ MaSP })

        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" })
        }
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
        }

        let cart = await ShoppingCart.findOne({ customer: customer._id })
        
        if (!cart) {
            cart = new ShoppingCart({
                customer: customer._id,
                products: []
            })
        }

        const existingProductIndex = cart.products.findIndex(
            item => item.product.toString() === product._id.toString()
        )

        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].soLuong += soLuong
        } else {
            cart.products.push({
                product: product._id,
                soLuong
            })
        }

        await cart.save()

        // Populate thông tin sản phẩm trước khi trả về
        await cart.populate('products.product')
        
        res.status(200).json(cart)
    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error)
        res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng" })
    }
}

// Lấy giỏ hàng của khách hàng
export const getCart = async(req, res) => {
    const { MaKH } = req.params
    try {
        const customer = await Customer.findOne({ MaKH })
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" })
        }

        const cart = await ShoppingCart.findOne({ customer: customer._id })
            .populate('products.product')

        if (!cart) {
            return res.status(200).json({ 
                customer: customer._id,
                products: [] 
            })
        }

        res.status(200).json(cart)
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error)
        res.status(500).json({ message: "Lỗi khi lấy giỏ hàng" })
    }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async(req, res) => {
    const { MaKH, MaSP, soLuong } = req.body
    try {
        if (!MaKH || !MaSP || soLuong === undefined) {
            return res.status(400).json({ message: "Thiếu thông tin cập nhật" })
        }

        const customer = await Customer.findOne({ MaKH })
        const product = await Product.findOne({ MaSP })

        if (!customer || !product) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng hoặc sản phẩm" })
        }

        const cart = await ShoppingCart.findOne({ customer: customer._id })
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" })
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === product._id.toString()
        )

        if (productIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" })
        }

        if (soLuong <= 0) {
            // Xóa sản phẩm khỏi giỏ hàng
            cart.products.splice(productIndex, 1)
        } else {
            // Cập nhật số lượng
            cart.products[productIndex].soLuong = soLuong
        }

        await cart.save()
        await cart.populate('products.product')
        
        res.status(200).json(cart)
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error)
        res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng" })
    }
}

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async(req, res) => {
    const { MaKH, MaSP } = req.body
    try {
        if (!MaKH || !MaSP) {
            return res.status(400).json({ message: "MaKH và MaSP là bắt buộc" })
        }

        const customer = await Customer.findOne({ MaKH })
        const product = await Product.findOne({ MaSP })

        if (!customer || !product) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng hoặc sản phẩm" })
        }

        const cart = await ShoppingCart.findOne({ customer: customer._id })
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" })
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === product._id.toString()
        )

        if (productIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" })
        }

        cart.products.splice(productIndex, 1)
        await cart.save()
        await cart.populate('products.product')

        res.status(200).json(cart)
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error)
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng" })
    }
}

// Xóa toàn bộ giỏ hàng
export const clearCart = async(req, res) => {
    const { MaKH } = req.body
    try {
        const customer = await Customer.findOne({ MaKH })
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" })
        }

        const cart = await ShoppingCart.findOne({ customer: customer._id })
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" })
        }

        cart.products = []
        await cart.save()

        res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng" })
    } catch (error) {
        console.error("Lỗi khi xóa giỏ hàng:", error)
        res.status(500).json({ message: "Lỗi khi xóa giỏ hàng" })
    }
}