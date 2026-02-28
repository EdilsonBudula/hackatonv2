import { useState, useRef, useEffect } from 'react';
import { Mic, FileText, FlaskConical, UtensilsCrossed, Upload, Camera, Square, Play, Trash2, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

type TabType = 'voice' | 'text' | 'lab' | 'meal';

export function LogEntry() {
  const [activeTab, setActiveTab] = useState<TabType>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textEntry, setTextEntry] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labAnalysis, setLabAnalysis] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const deleteRecording = () => {
    setAudioURL(null);
    setRecordingTime(0);
    setAnalysis(null);
  };

  const analyzeVoiceNote = async () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        transcript: 'Patient reports feeling dizzy and fatigued over the past 3 days. Blood pressure readings have been consistently high. Missed medication doses on Tuesday and Thursday.',
        keyFindings: [
          { type: 'symptom', text: 'Dizziness and fatigue', severity: 'moderate' },
          { type: 'metric', text: 'High blood pressure', severity: 'high' },
          { type: 'behavior', text: 'Medication non-adherence', severity: 'high' },
        ],
        recommendation: 'Immediate follow-up recommended. Consider cardiology consultation within 1-2 weeks.',
        riskScore: 72,
      });
      setAnalyzing(false);
    }, 2000);
  };

  const analyzeTextEntry = async () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      setAnalysis({
        keyFindings: [
          { type: 'symptom', text: 'Reported symptoms detected', severity: 'moderate' },
          { type: 'metric', text: 'Health metrics mentioned', severity: 'moderate' },
        ],
        recommendation: 'Continue monitoring. Log metrics daily.',
        riskScore: 65,
      });
      setAnalyzing(false);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLabFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLabFile(file);
      analyzeLabResults(file);
    }
  };

  const analyzeLabResults = async (file: File) => {
    setAnalyzing(true);

    // Simulate AI lab result analysis
    setTimeout(() => {
      setLabAnalysis({
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        results: [
          {
            test: 'Glucose (Fasting)',
            value: 142,
            unit: 'mg/dL',
            range: '70-100 mg/dL',
            status: 'high',
            trend: 'increasing',
          },
          {
            test: 'HbA1c',
            value: 7.2,
            unit: '%',
            range: '<5.7%',
            status: 'high',
            trend: 'stable',
          },
          {
            test: 'Cholesterol (Total)',
            value: 195,
            unit: 'mg/dL',
            range: '<200 mg/dL',
            status: 'normal',
            trend: 'stable',
          },
          {
            test: 'LDL Cholesterol',
            value: 125,
            unit: 'mg/dL',
            range: '<100 mg/dL',
            status: 'high',
            trend: 'increasing',
          },
          {
            test: 'HDL Cholesterol',
            value: 48,
            unit: 'mg/dL',
            range: '>40 mg/dL',
            status: 'normal',
            trend: 'stable',
          },
          {
            test: 'Blood Pressure',
            value: '152/95',
            unit: 'mmHg',
            range: '<120/80 mmHg',
            status: 'high',
            trend: 'increasing',
          },
        ],
        aiInsights: {
          riskLevel: 'elevated',
          summary: 'Lab results indicate elevated glucose levels and suboptimal cholesterol management. Combined with blood pressure readings, cardiovascular risk is increased.',
          recommendations: [
            'Schedule endocrinology consultation for glucose management review',
            'Consider adjusting diabetes medication regimen',
            'Dietary consultation recommended for cholesterol management',
            'Cardiology follow-up within 2-4 weeks for blood pressure management',
          ],
          criticalAlerts: [
            'Fasting glucose above target range - diabetes management review needed',
            'Blood pressure consistently elevated - immediate attention required',
          ],
        },
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">Log Entry</h1>
        <p className="text-gray-600">Record clinical observations, lab results, and track nutrition</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'voice'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span className="text-sm md:text-base">Voice Note</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'text'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm md:text-base">Text Entry</span>
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'lab'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span className="text-sm md:text-base">Lab Results</span>
        </button>
        <button
          onClick={() => setActiveTab('meal')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'meal'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-sm md:text-base">Meal Tracker</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200">
        {/* Voice Note Tab */}
        {activeTab === 'voice' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Voice Clinical Note</h3>

            {!audioURL ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-16 h-16 text-white" />
                  ) : (
                    <Mic className="w-16 h-16 text-white" />
                  )}
                </div>

                {isRecording ? (
                  <>
                    <p className="text-2xl font-semibold text-gray-900 mb-2">{formatTime(recordingTime)}</p>
                    <p className="text-gray-600 mb-6">Recording in progress...</p>
                    <button
                      onClick={stopRecording}
                      className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      Stop Recording
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 text-lg mb-6">Click to start recording your clinical note</p>
                    <button
                      onClick={startRecording}
                      className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                {/* Audio Player */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Mic className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Voice Recording</p>
                        <p className="text-sm text-gray-600">{formatTime(recordingTime)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={deleteRecording}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <audio src={audioURL} controls className="w-full" />
                </div>

                {/* Analyze Button */}
                {!analysis && (
                  <button
                    onClick={analyzeVoiceNote}
                    disabled={analyzing}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </button>
                )}

                {/* AI Analysis Results */}
                {analysis && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Transcript</h4>
                      <p className="text-gray-700">{analysis.transcript}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
                      <div className="space-y-2">
                        {analysis.keyFindings.map((finding: any, index: number) => (
                          <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                              finding.severity === 'high'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-orange-50 border-orange-200'
                            }`}
                          >
                            <AlertCircle
                              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                finding.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                              }`}
                            />
                            <div>
                              <span className="text-xs font-semibold text-gray-500 uppercase">
                                {finding.type}
                              </span>
                              <p className="text-gray-700">{finding.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">AI Recommendation</h4>
                      <p className="text-gray-700">{analysis.recommendation}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Health Risk Score</p>
                        <p className="text-3xl font-semibold text-orange-600">{analysis.riskScore}/100</p>
                      </div>
                      <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-medium">
                        Monitor
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Text Entry Tab */}
        {activeTab === 'text' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Clinical Text Entry</h3>
            <textarea
              value={textEntry}
              onChange={(e) => setTextEntry(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
              placeholder="Type your clinical observations, symptoms, or notes here...&#10;&#10;Example:&#10;- Feeling dizzy and fatigued for the past 3 days&#10;- Blood pressure readings: 152/95 mmHg&#10;- Missed medication on Tuesday and Thursday&#10;- Sleep quality poor, averaging 5-6 hours per night"
            />
            <button
              onClick={analyzeTextEntry}
              disabled={analyzing || !textEntry.trim()}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Entry'}
            </button>

            {/* Analysis Results */}
            {analysis && (
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
                  <div className="space-y-2">
                    {analysis.keyFindings.map((finding: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-orange-50 border-orange-200"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-600" />
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {finding.type}
                          </span>
                          <p className="text-gray-700">{finding.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">AI Recommendation</h4>
                  <p className="text-gray-700">{analysis.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lab Results Tab */}
        {activeTab === 'lab' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Lab Results Analysis</h3>

            {!labFile ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Lab Results</h3>
                <p className="text-gray-600 mb-6">AI will analyze your results and provide insights</p>
                <label className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                  Select File
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleLabFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">Supports PDF, JPEG, PNG • Max 10MB</p>
              </div>
            ) : (
              <div>
                {analyzing && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Analyzing lab results with AI...</p>
                    </div>
                  </div>
                )}

                {labAnalysis && (
                  <div className="space-y-6">
                    {/* Critical Alerts */}
                    {labAnalysis.aiInsights.criticalAlerts.length > 0 && (
                      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-red-900 text-lg mb-2">Critical Alerts</h4>
                            <ul className="space-y-2">
                              {labAnalysis.aiInsights.criticalAlerts.map((alert: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-red-600">⚠️</span>
                                  <span className="text-gray-700">{alert}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Risk Level Indicator */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Overall Risk Level</p>
                          <p className="text-3xl font-bold text-orange-600 uppercase">{labAnalysis.aiInsights.riskLevel}</p>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center">
                          <TrendingUp className="w-10 h-10 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    {/* Lab Results Grid */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg">Detailed Results</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {labAnalysis.results.map((result: any, index: number) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-2 ${
                              result.status === 'high'
                                ? 'bg-red-50 border-red-300'
                                : result.status === 'low'
                                ? 'bg-yellow-50 border-yellow-300'
                                : 'bg-green-50 border-green-300'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{result.test}</p>
                                <p className="text-xs text-gray-500 mt-1">Normal: {result.range}</p>
                              </div>
                              {result.trend === 'increasing' ? (
                                <TrendingUp className="w-5 h-5 text-red-500" />
                              ) : result.trend === 'decreasing' ? (
                                <TrendingDown className="w-5 h-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className={`text-2xl font-bold ${
                                result.status === 'high' ? 'text-red-600' :
                                result.status === 'low' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {result.value}
                              </span>
                              <span className="text-sm text-gray-600">{result.unit}</span>
                            </div>
                            <div className="mt-2">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                result.status === 'high'
                                  ? 'bg-red-200 text-red-800'
                                  : result.status === 'low'
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : 'bg-green-200 text-green-800'
                              }`}>
                                {result.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FlaskConical className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">AI Analysis Summary</h4>
                          <p className="text-gray-700 mb-4">{labAnalysis.aiInsights.summary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-3">Recommended Actions</h4>
                      <ul className="space-y-2">
                        {labAnalysis.aiInsights.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Meal Tracker Tab */}
        {activeTab === 'meal' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">Today's Nutrition</h3>
            </div>

            {/* Nutrition Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Calories</div>
                <div className="text-2xl font-semibold">0</div>
                <div className="text-xs text-gray-500">kcal</div>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Protein</div>
                <div className="text-2xl font-semibold">0g</div>
                <div className="text-xs text-gray-500">grams</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Carbs</div>
                <div className="text-2xl font-semibold">0g</div>
                <div className="text-xs text-gray-500">grams</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Fats</div>
                <div className="text-2xl font-semibold">0g</div>
                <div className="text-xs text-gray-500">grams</div>
              </div>
            </div>

            {/* Upload Photo */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Add Meal Photo</h4>
              <p className="text-gray-600 mb-6">Upload a photo of your meal for AI nutritional analysis</p>
              <label className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                Take or Upload Photo
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}