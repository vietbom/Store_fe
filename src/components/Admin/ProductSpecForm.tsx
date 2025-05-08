import React from 'react';
import { SpecType } from '../../apis/Product';

interface ProductSpecFormProps {
    spec: SpecType;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onArrayChange: (section: string, field: string, value: string) => void;
}

const ProductSpecForm: React.FC<ProductSpecFormProps> = ({ spec, onChange, onArrayChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin chung */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Thông tin chung</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nhà sản xuất</label>
                    <input
                        type="text"
                        name="general.manufacturer"
                        value={spec.general?.manufacturer || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: ASUS, MSI, Dell..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                        type="text"
                        name="general.model"
                        value={spec.general?.model || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: ROG Strix G16, Stealth 16 Studio..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Năm sản xuất</label>
                    <input
                        type="number"
                        name="general.releaseYear"
                        value={spec.general?.releaseYear || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 2024"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Màu sắc (phân cách bằng dấu phẩy)</label>
                    <input
                        type="text"
                        value={spec.general?.color?.join(', ') || ''}
                        onChange={(e) => onArrayChange('general', 'color', e.target.value)}
                        placeholder="Ví dụ: Đen, Xám, Bạc"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bảo hành</label>
                    <input
                        type="text"
                        name="general.warranty"
                        value={spec.general?.warranty || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 24 tháng"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Màn hình */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Màn hình</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kích thước</label>
                    <input
                        type="text"
                        name="display.size"
                        value={spec.display?.size || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 16 inch"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Độ phân giải</label>
                    <input
                        type="text"
                        name="display.resolution"
                        value={spec.display?.resolution || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 1920 x 1200"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại màn hình</label>
                    <input
                        type="text"
                        name="display.panelType"
                        value={spec.display?.panelType || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: IPS, OLED"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tần số quét</label>
                    <input
                        type="text"
                        name="display.refreshRate"
                        value={spec.display?.refreshRate || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 165Hz"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* CPU */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Bộ xử lý</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hãng</label>
                    <input
                        type="text"
                        name="processor.brand"
                        value={spec.processor?.brand || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: Intel, AMD"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Series</label>
                    <input
                        type="text"
                        name="processor.series"
                        value={spec.processor?.series || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: Core i7, Ryzen 7"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                        type="text"
                        name="processor.modelName"
                        value={spec.processor?.modelName || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 13650HX, 7840HS"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số nhân</label>
                    <input
                        type="number"
                        name="processor.cores"
                        value={spec.processor?.cores || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 14"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số luồng</label>
                    <input
                        type="number"
                        name="processor.threads"
                        value={spec.processor?.threads || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 20"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* RAM */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">RAM</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Dung lượng</label>
                    <input
                        type="text"
                        name="ram.type.capacity"
                        value={spec.ram?.type?.capacity || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 16GB"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại RAM</label>
                    <input
                        type="text"
                        name="ram.type.type"
                        value={spec.ram?.type?.type || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: DDR5"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tốc độ</label>
                    <input
                        type="text"
                        name="ram.type.speed"
                        value={spec.ram?.type?.speed || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 4800MHz"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Ổ cứng */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Lưu trữ</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại ổ cứng</label>
                    <input
                        type="text"
                        name="storage.type.type"
                        value={spec.storage?.type?.type || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: NVMe SSD"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Dung lượng</label>
                    <input
                        type="text"
                        name="storage.type.capacity"
                        value={spec.storage?.type?.capacity || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 512GB"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Card đồ họa */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Card đồ họa</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại</label>
                    <input
                        type="text"
                        name="graphics.type.type"
                        value={spec.graphics?.type?.type || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: Card rời"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hãng</label>
                    <input
                        type="text"
                        name="graphics.type.brand"
                        value={spec.graphics?.type?.brand || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: NVIDIA, AMD"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                        type="text"
                        name="graphics.type.model"
                        value={spec.graphics?.type?.model || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: RTX 4060 8GB GDDR6"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Pin */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Pin</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Dung lượng</label>
                    <input
                        type="text"
                        name="battery.capacity"
                        value={spec.battery?.capacity || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 90Whr"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thời lượng</label>
                    <input
                        type="text"
                        name="battery.life"
                        value={spec.battery?.life || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: Lên đến 6 tiếng"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Hệ điều hành */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Hệ điều hành</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên hệ điều hành</label>
                    <input
                        type="text"
                        name="operatingSystem.name"
                        value={spec.operatingSystem?.name || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: Windows 11 Home"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Kết nối */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Kết nối</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Wi-Fi</label>
                    <input
                        type="text"
                        name="connectivity.wifi"
                        value={spec.connectivity?.wifi || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: Wi-Fi 6E"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bluetooth</label>
                    <input
                        type="text"
                        name="connectivity.bluetooth"
                        value={spec.connectivity?.bluetooth || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: Bluetooth 5.2"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cổng kết nối (phân cách bằng dấu phẩy)</label>
                    <input
                        type="text"
                        value={spec.connectivity?.ports?.join(', ') || ''}
                        onChange={(e) => onArrayChange('connectivity', 'ports', e.target.value)}
                        placeholder="Ví dụ: USB 3.2, HDMI 2.1, Thunderbolt 4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Camera */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Camera</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Camera trước</label>
                    <input
                        type="text"
                        name="camera.front"
                        value={spec.camera?.front || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 720p HD"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Camera sau</label>
                    <input
                        type="text"
                        name="camera.rear"
                        value={spec.camera?.rear || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 1080p FHD"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Kích thước & Trọng lượng */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold border-b pb-2">Kích thước & Trọng lượng</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trọng lượng</label>
                    <input
                        type="text"
                        name="itemWeight.weight"
                        value={spec.itemWeight?.weight || ''}
                        onChange={onChange}
                        placeholder="Ví dụ: 2.3 kg"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductSpecForm; 