import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from '@/lib/formContext';
import { formOptions, traumaScoreInterpretation, traumaBondingScoreInterpretation } from '@/lib/assessmentUtils';

const TraumaSymptoms: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const traumaData = formData.traumaSymptoms;

  // Calculate total scores whenever individual scores change
  useEffect(() => {
    const ptsdTotalScore = traumaData.ptsdScores.reduce((sum, score) => sum + score, 0);
    const bondingTotalScore = traumaData.bondingScores.reduce((sum, score) => sum + score, 0);
    
    if (ptsdTotalScore !== traumaData.ptsdTotalScore || bondingTotalScore !== traumaData.bondingTotalScore) {
      updateFormData('traumaSymptoms', { 
        ptsdTotalScore, 
        bondingTotalScore 
      });
    }
  }, [traumaData.ptsdScores, traumaData.bondingScores]);

  const handlePtsdScoreChange = (index: number, value: number) => {
    const newScores = [...traumaData.ptsdScores];
    newScores[index] = value;
    updateFormData('traumaSymptoms', { ptsdScores: newScores });
  };

  const handleBondingScoreChange = (index: number, value: number) => {
    const newScores = [...traumaData.bondingScores];
    newScores[index] = value;
    updateFormData('traumaSymptoms', { bondingScores: newScores });
  };

  const getBondingScoreLabel = (score: number): string => {
    const labels = ['Not at all', 'Slightly', 'Moderately', 'Considerably', 'Extremely'];
    return labels[score] || score.toString();
  };

  const traumaResult = traumaScoreInterpretation(traumaData.ptsdTotalScore);
  const bondingResult = traumaBondingScoreInterpretation(traumaData.bondingTotalScore);

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">5. Trauma Symptoms (PTSD Checklist - PCL-5)</h2>
        <p className="text-gray-600 mb-6">
          In the past month, how much have you been bothered by these problems?
        </p>

        {/* Scale explanation */}
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">Rating scale:</h3>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-y-2">
            <div className="text-sm text-gray-600"><span className="font-medium">0:</span> Not at all</div>
            <div className="text-sm text-gray-600"><span className="font-medium">1:</span> A little bit</div>
            <div className="text-sm text-gray-600"><span className="font-medium">2:</span> Moderately</div>
            <div className="text-sm text-gray-600"><span className="font-medium">3:</span> Quite a bit</div>
            <div className="text-sm text-gray-600"><span className="font-medium">4:</span> Extremely</div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-md font-semibold text-gray-700">PTSD Symptoms</h3>
          
          {formOptions.traumaQuestions.map((question, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <div className="mb-3">
                <Label htmlFor={`trauma-${index}`} className="block text-sm font-medium text-gray-700">
                  {question}
                </Label>
              </div>
              <RadioGroup
                value={traumaData.ptsdScores[index].toString()}
                onValueChange={(value) => handlePtsdScoreChange(index, parseInt(value))}
                className="flex flex-wrap gap-y-2"
              >
                {[0, 1, 2, 3, 4].map((score) => (
                  <div key={score} className="flex items-center mr-4">
                    <RadioGroupItem value={score.toString()} id={`trauma-${index}-${score}`} />
                    <Label htmlFor={`trauma-${index}-${score}`} className="ml-1 text-sm text-gray-700">
                      {score}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          <h3 className="text-md font-semibold text-gray-700 mt-8">Trauma Bonding Assessment</h3>
          <p className="text-sm text-gray-600 mb-4">
            For the following questions, indicate how much you agree with each statement regarding your relationship with the perpetrator.
          </p>

          {formOptions.traumaBondingQuestions.map((question, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <div className="mb-3">
                <Label htmlFor={`bonding-${index}`} className="block text-sm font-medium text-gray-700">
                  {question}
                </Label>
              </div>
              <RadioGroup
                value={traumaData.bondingScores[index].toString()}
                onValueChange={(value) => handleBondingScoreChange(index, parseInt(value))}
                className="flex flex-wrap gap-y-2"
              >
                {[0, 1, 2, 3, 4].map((score) => (
                  <div key={score} className="flex items-center mr-4">
                    <RadioGroupItem value={score.toString()} id={`bonding-${index}-${score}`} />
                    <Label htmlFor={`bonding-${index}-${score}`} className="ml-1 text-sm text-gray-700">
                      {getBondingScoreLabel(score)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Trauma Scores Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">PCL-5 Score:</div>
              <div className="text-lg font-bold text-primary-700">{traumaData.ptsdTotalScore}</div>
            </div>
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-700 mb-1">PTSD Indication:</div>
              <div className={`text-sm ${traumaResult.color}`}>
                {traumaResult.level}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700">Trauma Bonding Score:</div>
              <div className="text-lg font-bold text-primary-700">{traumaData.bondingTotalScore}</div>
              <div className="mt-1">
                <div className="text-sm font-medium text-gray-700 mb-1">Interpretation:</div>
                <div className={`text-sm ${bondingResult.color}`}>
                  {bondingResult.level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraumaSymptoms;
