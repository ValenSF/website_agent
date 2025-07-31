import React, { useState, useEffect } from "react";
import { Button, Box, Text } from "@mantine/core";
import { IconHeadset, IconSparkles } from "@tabler/icons-react";

const CustomerCareButton = ({ liveChatUrl = "#" }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Detect if device is mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		// Check on initial load
		checkMobile();

		// Add event listener for window resize
		window.addEventListener('resize', checkMobile);

		// Cleanup
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<Box
			style={{
				position: "fixed",
				bottom: 24,
				right: 24,
				zIndex: 1000,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Main Button */}
			<Button
				component="a"
				href={liveChatUrl}
				target="_blank"
				rel="noopener noreferrer"
				size={isMobile ? "md" : "lg"}
				radius="xl"
				leftSection={!isMobile ? <IconHeadset size={20} /> : null}
				style={{
					background: isHovered 
						? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
						: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
					color: "#ffffff",
					fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
					fontSize: "15px",
					fontWeight: 600,
					padding: isMobile ? "16px" : "14px 28px",
					minHeight: isMobile ? "75px" : "56px",
					minWidth: isMobile ? "75px" : (isHovered ? "220px" : "200px"),
					width: isMobile ? "75px" : "auto",
					height: isMobile ? "75px" : "auto",
					borderRadius: isMobile ? "50%" : "28px",
					boxShadow: isHovered 
						? "0 20px 40px rgba(102, 126, 234, 0.4), 0 8px 16px rgba(0,0,0,0.1)"
						: "0 12px 28px rgba(245, 87, 108, 0.3), 0 4px 12px rgba(0,0,0,0.1)",
					transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
					border: "1px solid rgba(255,255,255,0.2)",
					backdropFilter: "blur(16px)",
					transform: isHovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					"&:hover": {
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					},
				}}
			>
				{isMobile ? (
					// Mobile: Only show icon
					<IconHeadset size={24} />
				) : (
					// Desktop: Show icon + text
					<Text
						component="span"
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							letterSpacing: "0.025em",
						}}
					>
						<IconSparkles size={16} style={{ opacity: 0.8 }} />
						Hubungi Kami
					</Text>
				)}
			</Button>

			{/* Mobile Label */}
			{isMobile && (
				<Text
					size="lg"
					fw={600}
					c="white"
					ta="center"
					mt={4}
					style={{
						textShadow: "0 1px 3px rgba(0,0,0,0.3)",
					}}
				>
					Live Chat
				</Text>
			)}

			{/* Animated Ring */}
			<Box
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: `calc(100% + ${isMobile ? "8px" : "8px"})`,
					height: `calc(100% + ${isMobile ? "8px" : "8px"})`,
					borderRadius: isMobile ? "50%" : "36px",
					background: "linear-gradient(45deg, #f093fb, #f5576c, #667eea, #764ba2)",
					opacity: isHovered ? 0.6 : 0.3,
					animation: "modernPulse 3s ease-in-out infinite",
					pointerEvents: "none",
					zIndex: -1,
				}}
			/>

			{/* Floating Particles - Adjust position for mobile */}
			<Box
				style={{
					position: "absolute",
					top: isMobile ? "-8px" : "-10px",
					right: isMobile ? "-4px" : "-5px",
					width: isMobile ? "6px" : "8px",
					height: isMobile ? "6px" : "8px",
					background: "linear-gradient(45deg, #f093fb, #f5576c)",
					borderRadius: "50%",
					opacity: isHovered ? 1 : 0.7,
					animation: "float1 4s ease-in-out infinite",
					pointerEvents: "none",
				}}
			/>

			<Box
				style={{
					position: "absolute",
					bottom: isMobile ? "-6px" : "-8px",
					left: isMobile ? "-6px" : "-8px",
					width: isMobile ? "4px" : "6px",
					height: isMobile ? "4px" : "6px",
					background: "linear-gradient(45deg, #667eea, #764ba2)",
					borderRadius: "50%",
					opacity: isHovered ? 1 : 0.6,
					animation: "float2 3.5s ease-in-out infinite 1s",
					pointerEvents: "none",
				}}
			/>

			<Box
				style={{
					position: "absolute",
					top: "20%",
					left: isMobile ? "-8px" : "-12px",
					width: "4px",
					height: "4px",
					background: "linear-gradient(45deg, #f5576c, #667eea)",
					borderRadius: "50%",
					opacity: isHovered ? 0.9 : 0.5,
					animation: "float3 4.5s ease-in-out infinite 2s",
					pointerEvents: "none",
				}}
			/>

			{/* Notification Dot - Adjust for mobile */}
			<Box
				style={{
					position: "absolute",
					top: isMobile ? "4px" : "8px",
					right: isMobile ? "4px" : "8px",
					width: isMobile ? "10px" : "12px",
					height: isMobile ? "10px" : "12px",
					background: "#00ff88",
					borderRadius: "50%",
					border: "2px solid #ffffff",
					boxShadow: "0 0 12px rgba(0, 255, 136, 0.6)",
					animation: "notificationBlink 2s ease-in-out infinite",
					pointerEvents: "none",
				}}
			/>

			{/* Modern CSS Animations */}
			<style>
				{`
					@keyframes modernPulse {
						0% {
							transform: translate(-50%, -50%) scale(1);
							opacity: 0.3;
						}
						50% {
							transform: translate(-50%, -50%) scale(1.05);
							opacity: 0.1;
						}
						100% {
							transform: translate(-50%, -50%) scale(1);
							opacity: 0.3;
						}
					}

					@keyframes float1 {
						0%, 100% {
							transform: translateY(0px) rotate(0deg);
							opacity: 0.7;
						}
						25% {
							transform: translateY(-8px) rotate(90deg);
							opacity: 1;
						}
						50% {
							transform: translateY(-4px) rotate(180deg);
							opacity: 0.8;
						}
						75% {
							transform: translateY(-12px) rotate(270deg);
							opacity: 0.9;
						}
					}

					@keyframes float2 {
						0%, 100% {
							transform: translateX(0px) translateY(0px) scale(1);
							opacity: 0.6;
						}
						33% {
							transform: translateX(8px) translateY(-6px) scale(1.2);
							opacity: 1;
						}
						66% {
							transform: translateX(-4px) translateY(-10px) scale(0.8);
							opacity: 0.8;
						}
					}

					@keyframes float3 {
						0%, 100% {
							transform: translateY(0px) translateX(0px);
							opacity: 0.5;
						}
						50% {
							transform: translateY(-15px) translateX(6px);
							opacity: 1;
						}
					}

					@keyframes notificationBlink {
						0%, 100% {
							opacity: 1;
							transform: scale(1);
						}
						50% {
							opacity: 0.4;
							transform: scale(0.8);
						}
					}

					/* Glass morphism effect on hover */
					@media (hover: hover) {
						.modern-button:hover::before {
							content: '';
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							background: linear-gradient(45deg, 
								rgba(255,255,255,0.1) 0%, 
								rgba(255,255,255,0.05) 50%, 
								rgba(255,255,255,0.1) 100%
							);
							border-radius: inherit;
							pointer-events: none;
						}
					}

					/* Mobile responsiveness */
					@media (max-width: 768px) {
						.modern-customer-care {
							bottom: 20px !important;
							right: 20px !important;
						}
					}

					/* Accessibility improvements */
					@media (prefers-reduced-motion: reduce) {
						* {
							animation-duration: 0.01ms !important;
							animation-iteration-count: 1 !important;
							transition-duration: 0.01ms !important;
						}
					}

					/* Dark mode support */
					@media (prefers-color-scheme: dark) {
						.modern-button {
							box-shadow: 0 12px 28px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3) !important;
						}
					}

					/* Mobile specific styles */
					@media (max-width: 768px) {
						.customer-care-button {
							width: 70px !important;
							height: 70px !important;
							min-width: 70px !important;
							border-radius: 50% !important;
							padding: 16px !important;
						}
					}
				`}
			</style>
		</Box>
	);
};

export default CustomerCareButton;