import { Activity, TrendingUp, TrendingDown, Heart, Pill, Moon, FileText, AlertCircle, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HealthMetric {
  value: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

export function Overview() {
  const [userName, setUserName] = useState('User');
  const [healthScore, setHealthScore] = useState(72);

  useEffect(() => {
    const profile = localStorage.getItem('medala_profile');
    if (profile) {
      const data = JSON.parse(profile);
      setUserName(data.firstName || 'User');
    }
  }, []);

  const metrics = {
    bloodPressure: { value: '152/95', trend: 'up' as const, status: 'critical' as const },
    glucose: { value: '142', trend: 'stable' as const, status: 'warning' as const },
    medication: { value: '75%', trend: 'down' as const, status: 'warning' as const },
    sleep: { value: '6.5h', trend: 'down' as const, status: 'warning' as const },
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'from-green-50 to-emerald-50 border-green-200';
    if (score >= 60) return 'from-orange-50 to-amber-50 border-orange-200';
    return 'from-red-50 to-pink-50 border-red-200';
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { text: 'Good', color: 'bg-green-100 text-green-700' };
    if (score >= 60) return { text: 'Monitor', color: 'bg-orange-100 text-orange-700' };
    return { text: 'Critical', color: 'bg-red-100 text-red-700' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable', status: string) => {
    if (trend === 'stable') return <Minus className="w-5 h-5 text-gray-500" />;
    if (trend === 'up') {
      return status === 'critical' || status === 'warning' ? 
        <TrendingUp className="w-5 h-5 text-red-500" /> : 
        <TrendingUp className="w-5 h-5 text-green-500" />;
    }
    return status === 'critical' || status === 'warning' ? 
      <TrendingDown className="w-5 h-5 text-red-500" /> : 
      <TrendingDown className="w-5 h-5 text-green-500" />;
  };

  const getMetricCardBorder = (status: string) => {
    if (status === 'critical') return 'border-2 border-red-300';
    if (status === 'warning') return 'border border-orange-300';
    return 'border border-gray-200';
  };

  const getMetricStatusBadge = (status: string) => {
    if (status === 'critical') return { text: 'Critical', color: 'bg-red-100 text-red-700' };
    if (status === 'warning') return { text: 'Warning', color: 'bg-orange-100 text-orange-700' };
    return { text: 'Normal', color: 'bg-green-100 text-green-700' };
  };

  const riskBadge = getRiskBadge(healthScore);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">{getTimeGreeting()}, {userName}</h1>
        <p className="text-gray-600">Your clinical health overview</p>
      </div>

      {/* Health Stability Score */}
      <div className={`bg-gradient-to-br ${getRiskColor(healthScore)} rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border-2`}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-gray-700 mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Health Stability Score</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-5xl md:text-6xl font-semibold ${getScoreColor(healthScore)}`}>{healthScore}</span>
              <span className="text-xl md:text-2xl text-gray-500">/100</span>
            </div>
            <div className={`inline-flex px-4 py-1 ${riskBadge.color} rounded-full text-sm font-medium`}>
              {riskBadge.text}
            </div>
          </div>
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-8 ${
            healthScore >= 80 ? 'border-green-200' : 
            healthScore >= 60 ? 'border-orange-200' : 
            'border-red-200'
          } flex items-center justify-center`}>
            <Activity className={`w-12 h-12 md:w-16 md:h-16 ${getScoreColor(healthScore)}`} />
          </div>
        </div>

        {/* Risk Indicator Bar */}
        <div className="mt-6 bg-white/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              healthScore >= 80 ? 'bg-green-500' :
              healthScore >= 60 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Blood Pressure */}
        <div className={`bg-white rounded-xl p-6 ${getMetricCardBorder(metrics.bloodPressure.status)}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            {getTrendIcon(metrics.bloodPressure.trend, metrics.bloodPressure.status)}
          </div>
          <div className="text-gray-600 text-sm mb-1">Blood Pressure</div>
          <div className="text-2xl font-semibold mb-1">{metrics.bloodPressure.value}</div>
          <div className="text-xs text-gray-500 mb-2">mmHg</div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            getMetricStatusBadge(metrics.bloodPressure.status).color
          }`}>
            {getMetricStatusBadge(metrics.bloodPressure.status).text}
          </span>
        </div>

        {/* Glucose Trend */}
        <div className={`bg-white rounded-xl p-6 ${getMetricCardBorder(metrics.glucose.status)}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            {getTrendIcon(metrics.glucose.trend, metrics.glucose.status)}
          </div>
          <div className="text-gray-600 text-sm mb-1">Glucose Level</div>
          <div className="text-2xl font-semibold mb-1">{metrics.glucose.value}</div>
          <div className="text-xs text-gray-500 mb-2">mg/dL</div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            getMetricStatusBadge(metrics.glucose.status).color
          }`}>
            {getMetricStatusBadge(metrics.glucose.status).text}
          </span>
        </div>

        {/* Medication Adherence */}
        <div className={`bg-white rounded-xl p-6 ${getMetricCardBorder(metrics.medication.status)}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-blue-500" />
            </div>
            {getTrendIcon(metrics.medication.trend, metrics.medication.status)}
          </div>
          <div className="text-gray-600 text-sm mb-1">Medication Adherence</div>
          <div className="text-2xl font-semibold mb-1">{metrics.medication.value}</div>
          <div className="text-xs text-gray-500 mb-2">Last 7 days</div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            getMetricStatusBadge(metrics.medication.status).color
          }`}>
            {getMetricStatusBadge(metrics.medication.status).text}
          </span>
        </div>

        {/* Sleep Stability */}
        <div className={`bg-white rounded-xl p-6 ${getMetricCardBorder(metrics.sleep.status)}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-500" />
            </div>
            {getTrendIcon(metrics.sleep.trend, metrics.sleep.status)}
          </div>
          <div className="text-gray-600 text-sm mb-1">Sleep Quality</div>
          <div className="text-2xl font-semibold mb-1">{metrics.sleep.value}</div>
          <div className="text-xs text-gray-500 mb-2">Average</div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            getMetricStatusBadge(metrics.sleep.status).color
          }`}>
            {getMetricStatusBadge(metrics.sleep.status).text}
          </span>
        </div>
      </div>

      {/* AI Clinical Summary */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">AI Clinical Summary</h2>
        </div>

        {/* Critical Alerts */}
        <div className="space-y-3 mb-6">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-red-900 mb-1">Critical Alert</div>
                <p className="text-gray-700">
                  Blood pressure has remained above recommended threshold (120/80) for 3 consecutive days. Combined with missed medication entries, cardiovascular risk is significantly elevated.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-orange-900 mb-1">Warning</div>
                <p className="text-gray-700">
                  Glucose levels trending above target range (100 mg/dL fasting). Recommend endocrinology consultation for medication adjustment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Risk Analysis */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-6">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Predictive Risk Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-purple-600">📊</span>
              <p className="text-gray-700">
                <span className="font-semibold">30-day cardiovascular event risk:</span> Moderate-High (18%)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600">📈</span>
              <p className="text-gray-700">
                <span className="font-semibold">Diabetes complication risk:</span> Based on current HbA1c trajectory, risk of complications increases by 12% if current trends continue
              </p>
            </div>
          </div>
        </div>

        {/* Summary Points */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <span className="text-red-500">•</span>
            <p className="text-gray-700"><span className="font-semibold">High Priority:</span> Medication adherence at 75% - below recommended 90% threshold. Missing doses increases risk of acute events.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-orange-500">•</span>
            <p className="text-gray-700"><span className="font-semibold">Concern:</span> Sleep quality declining - averaging 6.5 hours (target: 7-9 hours). Poor sleep correlates with elevated blood pressure.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-500">•</span>
            <p className="text-gray-700"><span className="font-semibold">Recommendation:</span> Cardiology follow-up within 2-4 weeks to assess blood pressure management strategy.</p>
          </div>
        </div>

        {/* Preventive Actions */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6">
          <h3 className="font-semibold text-emerald-900 mb-3">Suggested Preventive Actions</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-sm">✓</span>
              <p className="text-gray-700 text-sm">Set medication reminders for consistent daily adherence</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-sm">✓</span>
              <p className="text-gray-700 text-sm">Monitor blood pressure twice daily and log readings</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-sm">✓</span>
              <p className="text-gray-700 text-sm">Implement sleep hygiene routine to improve rest quality</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-sm">✓</span>
              <p className="text-gray-700 text-sm">Schedule urgent cardiology appointment (see Dr Schedule)</p>
            </div>
          </div>
        </div>

        {/* Generate Note Button */}
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
          <FileText className="w-5 h-5" />
          Generate Clinical Note
        </button>
      </div>
    </div>
  );
}