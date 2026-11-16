import React, { useState } from 'react';
import {
  X,
  Gift,
  Clock,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ShieldCheck,
} from 'lucide-react';
import { Employee, BenefitRedemption, BenefitCategory } from '../types';
import { NON_TAXABLE_BENEFITS_CATALOG } from '../data/benefitsCatalog';

interface BenefitsRewardsModalProps {
  employee: Employee;
  isFirstPlaceWinner: boolean;
  redemptions: BenefitRedemption[];
  onRedeemBenefit: (employeeId: string, benefitId: string) => void;
  onClose: () => void;
}

export const BenefitsRewardsModal: React.FC<BenefitsRewardsModalProps> = ({
  employee,
  isFirstPlaceWinner,
  redemptions,
  onRedeemBenefit,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | BenefitCategory>('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const employeeRedemptions = redemptions.filter(r => r.employeeId === employee.id);

  const filteredBenefits = NON_TAXABLE_BENEFITS_CATALOG.filter(
    b => selectedCategory === 'ALL' || b.category === selectedCategory
  );

  const handleClaim = (benefitId: string, benefitTitle: string) => {
    setFeedbackMsg(null);
    try {
      onRedeemBenefit(employee.id, benefitId);
      setFeedbackMsg({
        type: 'success',
        text: `Successfully claimed "${benefitTitle}"! Sent to manager fulfillment queue.`,
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Unable to claim benefit.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Banner */}
        <div className="p-6 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Non-Taxable L&amp;D Benefits &amp; Recognition Rewards</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Quiz Recognition Perks for {employee.name}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Complete weekly or optional quizzes to earn points toward non-taxable time off, professional development, and practical workplace perks. Missed quizzes never restrict previously earned rewards.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <div className="text-[11px] text-slate-400">Available Points</div>
              <div className="text-xl font-extrabold font-mono tabular-nums text-emerald-400">
                {employee.rewardPoints || 0} pts
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close rewards catalog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* First-Place Leaderboard Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isFirstPlaceWinner
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-3">
              <Trophy className={`w-5 h-5 shrink-0 ${isFirstPlaceWinner ? 'text-emerald-600' : 'text-amber-500'}`} />
              <div>
                <div className="font-bold">
                  {isFirstPlaceWinner
                    ? 'You are currently #1 on the L&D Leaderboard!'
                    : 'Half-Day Off Award: Currently Held by Another Participant'}
                </div>
                <div className="text-[11px] opacity-85">
                  The first-place quiz participant unlocks the exclusive &quot;Half a Day Off&quot; non-taxable recognition reward. Missed quizzes never restrict your earned points or rewards.
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono tabular-nums font-bold shrink-0">
              +40 pts base + 15 pts/correct + 20 pts perfect bonus
            </div>
          </div>

          {feedbackMsg && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 font-medium ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
            {(['ALL', 'Time Off', 'Professional Development', 'Practical or Fun Rewards'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All 9 Non-Taxable Benefits' : cat}
              </button>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBenefits.map(benefit => {
              const hasEnoughPoints = (employee.rewardPoints || 0) >= benefit.pointsCost;
              const lockedByRank = Boolean(benefit.firstPlaceOnly && !isFirstPlaceWinner);
              const canClaim = hasEnoughPoints && !lockedByRank;

              const CategoryIcon =
                benefit.category === 'Time Off'
                  ? Clock
                  : benefit.category === 'Professional Development'
                  ? GraduationCap
                  : Gift;

              return (
                <div
                  key={benefit.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1 font-semibold text-indigo-700">
                        <CategoryIcon className="w-3.5 h-3.5" />
                        <span>{benefit.category}</span>
                      </span>
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        {benefit.pointsCost} pts
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {benefit.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>

                    <div className="text-[11px] text-emerald-700 font-medium pt-1">
                      ✓ {benefit.taxTreatment}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleClaim(benefit.id, benefit.title)}
                    disabled={!canClaim}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      canClaim
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {lockedByRank
                      ? '#1 Leaderboard Rank Required'
                      : !hasEnoughPoints
                      ? `Need ${benefit.pointsCost - (employee.rewardPoints || 0)} More Pts`
                      : 'Claim Non-Taxable Benefit'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Employee Claimed Benefits History */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Your Claimed Non-Taxable Benefits ({employeeRedemptions.length})</span>
            </h4>

            {employeeRedemptions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No benefits claimed yet. Complete department quizzes to earn recognition points.
              </p>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Benefit</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3 text-right">Points</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employeeRedemptions.map(red => (
                      <tr key={red.id}>
                        <td className="py-2 px-3 font-mono tabular-nums text-slate-600">{red.date}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{red.benefitTitle}</td>
                        <td className="py-2 px-3 text-slate-600">{red.category}</td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700">
                          -{red.pointsSpent}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className={`font-semibold ${
                            red.status === 'Approved' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {red.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
