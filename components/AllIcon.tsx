import * as Icons from "lucide-react";
import { useState } from "react";
import { Search, X } from "lucide-react";

interface AllIconProps {
  name?: string;
  size?: number;
  className?: string;
  color?: string;
  showAllIcons?: boolean;
  onSelectIcon?: (iconName: string) => void;
}

export default function AllIcon({
  name = "ShoppingBag",
  size = 24,
  className = "",
  color = "currentColor",
  showAllIcons = false,
  onSelectIcon,
}: AllIconProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // সব আইকনের লিস্ট
  const availableIconsList = [
    // Shopping & E-commerce
    "ShoppingBag", "ShoppingCart", "ShoppingBasket", "Store", "Tag", "Tags",
    "CreditCard", "Wallet", "DollarSign", "Euro", "PoundSterling", "Yen",
    "Receipt", "ReceiptText", "Ticket", "Gift", "Package", "PackageOpen",
    "Box", "Archive", "Truck", "ShippingBox", "Delivery", "Mailbox",

    // User & Profile
    "User", "Users", "UserPlus", "UserMinus", "UserCheck", "UserX", "UserCircle",
    "UserRound", "UsersRound", "UserRoundPlus", "UserRoundMinus", "UserRoundCheck",
    "UserRoundX", "CircleUser", "CircleUserRound", "Contact", "Contact2",
    "Heart", "HeartHandshake", "HeartCrack", "HeartPulse", "Activity", "Pulse",

    // Communication & Social
    "MessageCircle", "MessageSquare", "MessagesSquare", "MessageCircleMore",
    "MessageSquareMore", "MessageCircleReply", "MessageSquareReply",
    "MessageCirclePlus", "MessageSquarePlus", "Mail", "MailOpen", "MailPlus",
    "MailMinus", "MailCheck", "MailX", "MailQuestion", "MailSearch", "MailWarning",
    "Send", "Inbox", "Outbox", "Phone", "PhoneCall", "PhoneForwarded",
    "PhoneIncoming", "PhoneMissed", "PhoneOff", "PhoneOutgoing", "Smartphone",

    // Social Media Brands
    "Facebook", "Twitter", "Instagram", "Linkedin", "Github", "Gitlab",
    "Youtube", "Tiktok", "Snapchat", "Pinterest", "Reddit", "Whatsapp",
    "Telegram", "Discord", "Twitch", "Tumblr", "Dribbble", "Behance",
    "Figma", "Slack", "Medium", "Codepen", "Codesandbox",

    // Media & Entertainment
    "Music", "Music2", "Music3", "Music4", "Headphones", "HeadphoneOff",
    "Microphone", "MicrophoneOff", "Radio", "RadioReceiver", "Tv", "Tv2",
    "Film", "Clapperboard", "Video", "VideoOff", "Camera", "CameraOff",
    "Webcam", "Image", "Images", "ImagePlus", "ImageMinus", "ImageOff",
    "Palette", "Paintbrush", "Paintbrush2", "PenTool", "Pencil", "Brush",
    "Eraser", "Scissors", "Ruler", "Frame", "Crop", "Focus",

    // Files & Documents
    "File", "Files", "FileText", "FilePlus", "FileMinus", "FileCheck",
    "FileX", "FileSearch", "FileWarning", "FileStack", "FileBox",
    "FileKey", "FileLock", "FileLock2", "FileSignature", "FileCode",
    "FileJson", "FileImage", "FileVideo", "FileAudio", "FileSpreadsheet",
    "FilePieChart", "FileBarChart", "FileLineChart", "Folder", "Folders",
    "FolderPlus", "FolderMinus", "FolderCheck", "FolderX", "FolderOpen",
    "FolderRoot", "FolderSearch", "FolderSync", "FolderKey", "FolderLock",
    "FolderArchive", "FolderGit", "FolderGit2", "FolderKanban", "FolderTree",

    // Business & Office
    "Briefcase", "BriefcaseBusiness", "BriefcaseMedical", "Building",
    "Building2", "Banknote", "Landmark", "Factory", "Warehouse",
    "School", "University", "Hospital", "Stethoscope", "Pill", "PillBottle",
    "Syringe", "Thermometer", "Clipboard", "ClipboardList", "ClipboardCheck",
    "ClipboardCopy", "ClipboardEdit", "ClipboardPen", "ClipboardType",
    "Calendar", "CalendarDays", "CalendarClock", "CalendarRange", "CalendarCheck",
    "CalendarX", "CalendarPlus", "CalendarMinus", "CalendarSearch", "CalendarHeart",
    "CalendarOff", "Clock", "Clock3", "Clock4", "Clock5", "Clock6", "Clock7",
    "Clock8", "Clock9", "Clock10", "Clock11", "Clock12", "AlarmClock",
    "AlarmClockCheck", "AlarmClockMinus", "AlarmClockPlus", "AlarmClockOff",
    "Timer", "TimerOff", "TimerReset", "Stopwatch", "Watch",

    // Navigation & Travel
    "Map", "MapPin", "MapPinOff", "MapPinned", "Compass", "Navigation",
    "Navigation2", "NavigationOff", "Locate", "LocateOff", "Globe",
    "Globe2", "Earth", "EarthLock", "Plane", "PlaneLanding", "PlaneTakeoff",
    "Train", "TrainFront", "TrainTrack", "Bus", "Car", "CarFront", "CarTaxiFront",
    "Truck", "Bike", "Fuel", "ChargingStation", "ParkingCircle", "ParkingSquare",
    "TrafficCone", "Signal", "Wifi", "WifiOff", "Bluetooth", "BluetoothOff",

    // Home & Living
    "Home", "HomePlus", "HomeMinus", "HomeHeart", "HomeIcon", "DoorClosed",
    "DoorOpen", "Bed", "BedDouble", "BedSingle", "CookingPot", "Microwave",
    "Refrigerator", "WashingMachine", "Utensils", "UtensilsCrossed", "Coffee",
    "Beer", "Wine", "WineOff", "Cake", "Pizza", "Apple", "Egg", "EggFried",
    "Milk", "Cheese", "IceCream", "Candy", "Lollipop", "Popcorn",

    // Technology & Devices
    "Laptop", "Laptop2", "Monitor", "MonitorCheck", "MonitorDot", "MonitorDown",
    "MonitorOff", "MonitorPause", "MonitorPlay", "MonitorSmartphone", "MonitorSpeaker",
    "MonitorStop", "MonitorUp", "MonitorX", "Phone", "PhoneCall", "Tablet",
    "TabletSmartphone", "Smartphone", "SmartphoneCharging", "SmartphoneNfc",
    "Computer", "Cpu", "HardDrive", "HardDriveDownload", "HardDriveUpload",
    "Server", "Database", "Cloud", "CloudDownload", "CloudUpload", "CloudSun",
    "CloudMoon", "CloudRain", "CloudSnow", "CloudFog", "CloudLightning",
    "CloudHail", "CloudDrizzle", "CloudCog", "CloudOff",

    // Development & Coding
    "Code", "Code2", "CodeSquare", "CodeXml", "Braces", "Brackets", "Terminal",
    "TerminalSquare", "GitBranch", "GitBranchPlus", "GitCommit", "GitCompare",
    "GitFork", "GitGraph", "GitMerge", "GitPullRequest", "GitPullRequestArrow",
    "GitPullRequestClosed", "GitPullRequestCreate", "GitPullRequestCreateArrow",
    "GitPullRequestDraft", "Command", "Keyboard", "Mouse", "MousePointer",
    "MousePointer2", "MousePointerClick", "MousePointerSquare",

    // Games & Gaming
    "Gamepad", "Gamepad2", "Joystick", "Dice1", "Dice2", "Dice3", "Dice4",
    "Dice5", "Dice6", "ChessKnight", "ChessBishop", "ChessKing", "ChessQueen",
    "ChessRook", "ChessPawn", "Controller", "Play", "Pause", "Stop", "SkipBack",
    "SkipForward", "Rewind", "FastForward", "Volume1", "Volume2", "VolumeX",
    "VolumeOff", "Volume", "Mic", "MicOff",

    // Nature & Weather
    "Sun", "SunMoon", "Sunrise", "Sunset", "Moon", "Cloud", "CloudRain",
    "CloudSnow", "CloudLightning", "CloudFog", "CloudSun", "CloudMoon",
    "Cloudy", "Wind", "Tornado", "Thermometer", "Droplet", "Droplets",
    "Snowflake", "Flame", "Fire", "Leaf", "Flower", "Sprout", "Mountain",
    "Wave", "Waves", "Umbrella", "Rainbow",

    // Shapes & Objects
    "Circle", "Square", "Triangle", "Hexagon", "Pentagon", "Octagon",
    "Star", "StarHalf", "StarOff", "Sparkles", "Sparkle", "Gem", "Crown",
    "Award", "Trophy", "Medal", "Ribbon", "Badge", "BadgeCheck", "Verified",
    "Shield", "ShieldCheck", "ShieldAlert", "Lock", "LockOpen", "Key",

    // Health & Fitness
    "Activity", "Heart", "HeartPulse", "Stethoscope", "Syringe", "Pill",
    "Brain", "Dumbbell", "Footprints", "Hand", "Handshake", "Hospital",

    // Actions & Interface
    "Plus", "Minus", "X", "Check", "Search", "Settings", "Menu", "MoreHorizontal",
    "MoreVertical", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "ChevronUp", "ChevronDown", "ChevronLeft", "ChevronRight", "RefreshCw",
    "RotateCw", "Repeat", "Shuffle", "Power", "ToggleLeft", "ToggleRight",

    // Alerts & Status
    "AlertCircle", "AlertTriangle", "Bell", "Info", "HelpCircle", "Loader2",
    "Wifi", "Battery", "Zap", "Plug",

    // Logos & Brands
    "Apple", "Google", "Chrome", "Firefox", "React", "Nextjs", "Vue", "Angular",
    "Github", "Gitlab", "Docker", "Aws", "Azure", "Vercel", "Netlify", "Supabase",
    "Firebase", "Mongodb", "Postgresql", "Redis", "Graphql", "Prisma", "Wordpress",
  ];

  // সার্চ টার্ম অনুযায়ী আইকন ফিল্টার করা
  const filteredIcons = availableIconsList.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // সিঙ্গেল আইকন রেন্ডার করার জন্য
  const SingleIcon = () => {
    const IconComponent = (Icons as any)[name];

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in lucide-react`);
      return <span className="text-red-500">Icon not found</span>;
    }

    return (
      <IconComponent
        size={size}
        className={className}
        color={color}
        strokeWidth={1.5}
      />
    );
  };

  // সব আইকন গ্রিড আকারে দেখানোর জন্য (সার্চ সহ)
  const AllIconsGrid = () => {
    return (
      <div className="w-full">
        {/* সার্চ বক্স */}
        <div className="relative p-3 border-b border-slate-200">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-5 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* আইকন কাউন্ট */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
          <p className="text-xs text-slate-500">
            Found {filteredIcons.length} icons
          </p>
        </div>

        {/* আইকন গ্রিড */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1.5 p-3 max-h-72 overflow-y-auto">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((iconName) => {
              const IconComponent = (Icons as any)[iconName];
              if (!IconComponent) return null;

              return (
                <button
                  key={iconName}
                  onClick={() => {
                    onSelectIcon?.(iconName);
                    setSearchTerm(""); // সার্চ ক্লিয়ার করুন
                  }}
                  className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-all group border border-slate-200 hover:border-blue-400"
                >
                  <IconComponent
                    size={24}
                    className="text-slate-600 group-hover:text-blue-600 transition-colors"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] text-slate-500 group-hover:text-blue-600 text-center break-all">
                    {iconName}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No icons found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // যদি সব আইকন দেখাতে চান
  if (showAllIcons) {
    return <AllIconsGrid />;
  }

  // যদি শুধু একটি নির্দিষ্ট আইকন দেখাতে চান
  return <SingleIcon />;
}