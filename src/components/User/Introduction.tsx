import React from 'react';

const Introduction: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Thành lập vào năm 2025 bởi Nguyễn Đức Việt, DucVietStore ra đời với sứ mệnh mang đến những sản phẩm điện tử chất lượng cao, giá cả hợp lý cho người tiêu dùng Việt Nam.
              </p>
              <p>
                Từ một cửa hàng nhỏ tại Hà Tĩnh, chúng tôi đã nhanh chóng mở rộng với hơn 15 chi nhánh trên toàn quốc và xây dựng một nền tảng thương mại điện tử hiện đại, trở thành một trong những nhà bán lẻ thiết bị điện tử hàng đầu.
              </p>
              <p>
                Là đối tác chính thức của các thương hiệu toàn cầu như Apple, Samsung, Dell, Acer, Lenovo, chúng tôi cam kết mang đến sản phẩm chính hãng và công nghệ tiên tiến nhất cho khách hàng.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://res.cloudinary.com/dxbjy97kr/image/upload/v1746719998/web_abgg3z.jpg"
              alt="DucVietStore showcase"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-gray-50 rounded-2xl p-10 mb-16 shadow-md">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-blue-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                ),
                title: 'Chất lượng',
                description: 'Cam kết cung cấp sản phẩm chính hãng 100%, đảm bảo sự hài lòng tối đa cho khách hàng.',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-blue-600"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                ),
                title: 'Dịch vụ khách hàng',
                description: 'Đặt khách hàng làm trung tâm, luôn lắng nghe và đáp ứng nhu cầu một cách tận tâm.',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-blue-600"
                  >
                    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                  </svg>
                ),
                title: 'Đổi mới',
                description: 'Không ngừng cập nhật và đổi mới để mang đến sản phẩm và dịch vụ tốt nhất.',
              },
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Development History Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Lịch sử phát triển</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 w-0.5 h-full bg-gray-200"></div>
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -left-8 w-4 h-4 bg-blue-600 rounded-full top-2"></div>
                <p className="text-gray-700 text-lg">
                  <strong>2025:</strong> Thành lập cửa hàng đầu tiên tại Hà Tĩnh, đánh dấu bước khởi đầu của DucVietStore.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Đối tác của chúng tôi</h2>
          <div className="flex flex-wrap gap-6">
            {[
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746719997/apple_kheby2.png', alt: 'Apple logo' },
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746719997/samsung_u4okqw.png', alt: 'Samsung logo' },
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746719999/del_v66iew.jpg', alt: 'Dell logo' },
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746719997/acer_xsbqvm.jpg', alt: 'Acer logo' },
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746720021/lenovo_yax6tu.jpg', alt: 'Lenovo logo' },
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746719997/msi_yeezuw.jpg', alt: 'MSI logo' },
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746720380/xiaomi_lnkndl.jpg', alt: 'Xiaomi logo' },
              { src: 'https://res.cloudinary.com/dxbjy97kr/image/upload/v1746720006/logitech_xjy2wc.png', alt: 'Logitech logo' },
            ].map((partner, index) => (
              <img
                key={index}
                src={partner.src}
                alt={partner.alt}
                className="h-14 object-contain transition-transform hover:scale-105"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;