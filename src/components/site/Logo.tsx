export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kaito Hiro Logo"
    >
      {/* Background putih agar tetap terlihat jelas di mode gelap */}
      <circle cx="100" cy="100" r="99" fill="white" />
      
      <circle cx="100" cy="100" r="95" stroke="#002D72" strokeWidth="6" />
      <circle cx="100" cy="100" r="86" stroke="#002D72" strokeWidth="2.5" />
      
      <text 
        x="100" 
        y="94" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontSize="52" 
        fontWeight="900" 
        fill="#002D72" 
        textAnchor="middle" 
        letterSpacing="2"
      >
        KTH
      </text>
      
      <line x1="45" y1="106" x2="155" y2="106" stroke="#002D72" strokeWidth="3" />
      
      <text 
        x="100" 
        y="130" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontSize="17" 
        fontWeight="800" 
        fill="#002D72" 
        textAnchor="middle" 
        letterSpacing="4"
      >
        KAITO HIRO
      </text>
      
      <text 
        x="100" 
        y="158" 
        fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif" 
        fontSize="18" 
        fontWeight="700" 
        fill="#002D72" 
        textAnchor="middle"
        letterSpacing="6"
      >
        かいと ひろ
      </text>
    </svg>
  );
}
