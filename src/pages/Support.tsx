import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MapPin, Globe, HelpCircle } from "lucide-react";

const Support = () => {
  const supportServices = [
    {
      title: "Centre for Student Support Services (CSSS)",
      description: "The Centre for Student Support Services (CSSS) offers holistic student development and wellness support to enhance academic performance, personal growth, and social engagement. It serves as the central hub for non-academic student services.",
      units: [
        "Academic Support & Development",
        "Therapeutic Services (Counselling & Mental Health)",
        "Disability Services",
        "Leadership & Social Responsibility Office",
        "Graduate and Student Success Programmes"
      ],
      contact: {
        location: "2nd Floor, CHS Building, Main Campus",
        email: "csss@uwc.ac.za",
        phone: "+27 21 959 2299",
        website: "uwc.ac.za – CSSS"
      }
    },
    {
      title: "Disability Services",
      description: "Supports students with physical, sensory, learning, and psychological disabilities to ensure equal access to academic and campus life.",
      services: [
        "Assistive technology and accessible learning materials",
        "Academic accommodations (e.g., extra time, accessible venues)",
        "Orientation and awareness workshops",
        "Advocacy for disability inclusion"
      ],
      contact: {
        location: "2nd Floor, CHS Building",
        email: "disability@uwc.ac.za",
        phone: "+27 21 959 2299",
        website: "uwc.ac.za – Disability Services"
      }
    },
    {
      title: "Therapeutic Services (Counselling & Mental Health)",
      description: "Provides confidential psychological and emotional support to students facing stress, anxiety, or personal difficulties. The service promotes mental wellbeing and resilience.",
      services: [
        "Individual and group counselling",
        "Crisis intervention",
        "Mental health awareness and workshops",
        "24/7 student helpline",
        "Access to the Wysa wellbeing app (AI chatbot for mental health support)"
      ],
      contact: {
        location: "2nd Floor, CHS Building",
        email: "csss@uwc.ac.za",
        phone: "Toll-Free Helpline: 0800 222 333",
        website: "uwc.ac.za – Therapeutic Services"
      },
      additional: {
        title: "Wysa App Info",
        details: [
          "Download: Google Play / App Store",
          "Referral Code: UWCT2023",
          "Free, anonymous, available 24/7"
        ]
      }
    },
    {
      title: "Leadership and Social Responsibility (LSR)",
      description: "Encourages active citizenship, leadership, and community involvement among students. Provides volunteering opportunities and leadership training.",
      services: [
        "Leadership workshops and seminars",
        "Community engagement projects",
        "Volunteer programmes",
        "Student leadership awards"
      ],
      contact: {
        email: "csss@uwc.ac.za",
        website: "uwc.ac.za – LSR Office"
      }
    },
    {
      title: "Career Services",
      description: "Career Services prepares students for employment through skills development, guidance, and employer partnerships.",
      services: [
        "Career counselling & CV support",
        "Job readiness and interview workshops",
        "Internship and graduate programme listings",
        "Employer networking & Career Fairs",
        "Online portal: Career Xplora"
      ],
      contact: {
        location: "Room 165, Student Centre",
        email: "careerxplora@uwc.ac.za",
        phone: "+27 21 959 2436",
        website: "uwc.ac.za – Career Services"
      }
    },
    {
      title: "First Year Experience (FYE) / First Year Transition Programme (FYTP)",
      description: "A university-wide initiative to help first-year students adjust to academic and social life at UWC through structured guidance, mentorship, and resources.",
      services: [
        "Peer mentoring",
        "Faculty-based First Year Transition Officers (FYTOs)",
        "Orientation & transition events",
        "Study and time management workshops"
      ],
      contact: {
        email: "Faculty-based FYTOs (e.g., fytp-arts@uwc.ac.za)",
        website: "uwc.ac.za – FYE"
      }
    },
    {
      title: "Residential Services (ResLife)",
      description: "Manages student residences and creates a supportive, learning-centered residential community.",
      services: [
        "On-campus and off-campus accommodation",
        "ResLife leadership and mentorship programmes",
        "Wellness and academic support in residences",
        "Maintenance and housing allocation"
      ],
      contact: {
        location: "ResLife Centre, Main Campus",
        email: "resservices1@uwc.ac.za (First-year students)",
        email2: "resservices2@uwc.ac.za (Returning students)",
        phone: "+27 21 959 2569",
        website: "uwc.ac.za – Residential Services"
      }
    },
    {
      title: "Financial Aid Office (FAO)",
      description: "Helps students access funding and manage financial assistance during their studies.",
      services: [
        "NSFAS applications and queries",
        "Bursaries and scholarships",
        "Merit awards and donor-funded programmes",
        "Financial literacy support"
      ],
      contact: {
        location: "Prefabs behind the Administration Building",
        email: "finaid@uwc.ac.za",
        phone: "+27 21 959 9753 / 2737",
        website: "uwcfinaid.uwc.ac.za"
      }
    },
    {
      title: "Student Administration",
      description: "Handles official student academic records, registration, exams, and certifications.",
      services: [
        "Registration and enrolment",
        "Exam results and transcripts",
        "Student cards and records updates",
        "Graduation documentation"
      ],
      contact: {
        location: "Ground Floor, Administration Building",
        email: "studentadmin@uwc.ac.za",
        phone: "+27 21 959 3900",
        website: "uwc.ac.za – Student Administration"
      }
    },
    {
      title: "Campus Health Clinic",
      description: "Provides confidential and affordable primary healthcare and wellness services to students and staff.",
      services: [
        "General medical consultations",
        "Sexual & reproductive health",
        "HIV testing, counselling and chronic care",
        "Health promotion and vaccination campaigns"
      ],
      contact: {
        location: "Basement Level, Student Centre",
        email: "campushealth@uwc.ac.za",
        phone: "+27 21 959 2876 / 2352",
        website: "uwc.ac.za – Campus Health"
      }
    },
    {
      title: "Centre for Postgraduate Studies (CPS)",
      description: "Supports postgraduate students in research, writing, and professional development.",
      services: [
        "Postgraduate skills development workshops",
        "Thesis/dissertation writing support",
        "Supervisor development",
        "Research funding information"
      ],
      contact: {
        location: "1st Floor, Prefab Building (next to Admin Building)",
        email: "cps@uwc.ac.za",
        phone: "+27 21 959 4039",
        website: "uwc.ac.za – CPS"
      }
    },
    {
      title: "Campus Protection Services (CPS)",
      description: "Ensures the safety and security of students, staff, and property on campus. Operates 24/7.",
      services: [
        "Emergency response and patrols",
        "Lost and found office",
        "Access control and parking permits",
        "Escort and safety assistance"
      ],
      contact: {
        location: "CPS Control Room, Near Student Centre",
        phone: "021 959 2222 / 2405 (24/7 Emergency Line)",
        website: "uwc.ac.za – CPS"
      }
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orama-primary flex items-center gap-2 sm:gap-3">
          <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          UWC Student Support Services
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2 sm:mt-3">
          Access comprehensive support services to help you succeed at the University of the Western Cape
        </p>
      </div>

      {/* Emergency Contact Card */}
      <Card className="bg-red-50 border-red-200 shadow-lg">
        <CardHeader className="bg-red-600 text-white p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base">Campus Protection Services (24/7):</span>
              </div>
              <a href="tel:0219592222" className="text-red-600 hover:text-red-700 font-bold text-sm sm:text-base">
                021 959 2222 / 2405
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base">Mental Health Helpline (24/7):</span>
              </div>
              <a href="tel:0800222333" className="text-red-600 hover:text-red-700 font-bold text-sm sm:text-base">
                0800 222 333
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Services Accordion */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Student Support Services Directory</CardTitle>
          <CardDescription className="text-orama-light-blue text-xs sm:text-sm">
            Click on any service below to view detailed information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {supportServices.map((service, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left hover:text-orama-primary font-semibold text-sm sm:text-base lg:text-lg py-3 sm:py-4">
                  {service.title}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 sm:pb-6">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Description */}
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-orama-primary">
                      <p className="text-xs sm:text-sm text-gray-700">{service.description}</p>
                    </div>

                    {/* Units (for CSSS) */}
                    {service.units && (
                      <div>
                        <h4 className="font-semibold text-orama-primary mb-2 text-xs sm:text-sm">Main Units:</h4>
                        <ul className="space-y-1 ml-3 sm:ml-4">
                          {service.units.map((unit, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-gray-600">• {unit}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Services */}
                    {service.services && (
                      <div>
                        <h4 className="font-semibold text-orama-primary mb-2 text-xs sm:text-sm">Key Services:</h4>
                        <ul className="space-y-1 ml-3 sm:ml-4">
                          {service.services.map((item, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Info (Wysa) */}
                    {service.additional && (
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-700 mb-2 text-xs sm:text-sm">{service.additional.title}:</h4>
                        <ul className="space-y-1 ml-3 sm:ml-4">
                          {service.additional.details.map((detail, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-gray-700">• {detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold text-orama-primary mb-2 sm:mb-3 text-xs sm:text-sm">Contact Information:</h4>
                      <div className="space-y-2">
                        {service.contact.location && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orama-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-gray-700">{service.contact.location}</span>
                          </div>
                        )}
                        {service.contact.email && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orama-primary flex-shrink-0 mt-0.5" />
                            <a 
                              href={`mailto:${service.contact.email.split(' ')[0]}`}
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                            >
                              {service.contact.email}
                            </a>
                          </div>
                        )}
                        {service.contact.email2 && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orama-primary flex-shrink-0 mt-0.5" />
                            <a 
                              href={`mailto:${service.contact.email2.split(' ')[0]}`}
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                            >
                              {service.contact.email2}
                            </a>
                          </div>
                        )}
                        {service.contact.phone && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-orama-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-gray-700">{service.contact.phone}</span>
                          </div>
                        )}
                        {service.contact.website && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-orama-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-gray-700 break-all">{service.contact.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            For more information about any of these services, please visit the official UWC website at{" "}
            <a href="https://www.uwc.ac.za" target="_blank" rel="noopener noreferrer" className="text-orama-primary hover:underline font-semibold">
              www.uwc.ac.za
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
