import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Stack,
  Alert,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  CompareArrows as CompareIcon,
  TrendingUp as TrendingIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

function EmailComparison() {
  const [versions, setVersions] = useState([
    { 
      id: 1, 
      content: '', 
      metrics: { 
        openRate: 0, 
        clickRate: 0, 
        conversionRate: 0,
        engagementScore: 0,
        subjectLineScore: 0,
        contentScore: 0,
      },
      recommendations: [],
      isLoading: false
    },
    { 
      id: 2, 
      content: '', 
      metrics: { 
        openRate: 0, 
        clickRate: 0, 
        conversionRate: 0,
        engagementScore: 0,
        subjectLineScore: 0,
        contentScore: 0,
      },
      recommendations: [],
      isLoading: false
    },
  ]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const analyzeEmail = (content) => {
    // Analyse détaillée de l'email
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const paragraphs = content.split(/\n\s*\n/).length;
    
    // Détection des éléments clés
    const hasCallToAction = content.toLowerCase().includes('click here') || 
                          content.toLowerCase().includes('learn more') ||
                          content.toLowerCase().includes('découvrir') ||
                          content.toLowerCase().includes('en savoir plus');
    const hasPersonalization = content.includes('{name}') || 
                             content.includes('{company}');
    const hasUrgency = content.toLowerCase().includes('limited time') || 
                      content.toLowerCase().includes('offre limitée') ||
                      content.toLowerCase().includes('dernière chance');
    const hasBenefits = content.toLowerCase().includes('benefit') || 
                       content.toLowerCase().includes('avantage') ||
                       content.toLowerCase().includes('gain');
    
    // Calcul des scores
    const readabilityScore = Math.max(0, 100 - (words / 2));
    const structureScore = paragraphs >= 3 ? 100 : (paragraphs / 3) * 100;
    const engagementScore = [
      hasCallToAction ? 25 : 0,
      hasPersonalization ? 25 : 0,
      hasUrgency ? 25 : 0,
      hasBenefits ? 25 : 0,
    ].reduce((a, b) => a + b, 0);
    
    return {
      wordCount: words,
      sentenceCount: sentences,
      paragraphCount: paragraphs,
      hasCallToAction,
      hasPersonalization,
      hasUrgency,
      hasBenefits,
      readabilityScore,
      structureScore,
      engagementScore,
      readability: words > 200 ? 'Difficile' : 'Facile',
    };
  };

  const generateMetrics = (analysis) => {
    // Génération de métriques basées sur l'analyse
    const baseOpenRate = 20 + (analysis.engagementScore * 0.3);
    const baseClickRate = 5 + (analysis.engagementScore * 0.2);
    const baseConversionRate = 2 + (analysis.engagementScore * 0.1);

    // Calcul plus précis de l'engagement
    const engagementFactors = [
      analysis.hasCallToAction ? 30 : 0,
      analysis.hasPersonalization ? 25 : 0,
      analysis.hasUrgency ? 20 : 0,
      analysis.hasBenefits ? 25 : 0,
      analysis.readabilityScore * 0.2,
      analysis.structureScore * 0.2,
    ];

    const engagementScore = Math.min(100, engagementFactors.reduce((a, b) => a + b, 0));

    return {
      openRate: Math.min(100, baseOpenRate + (Math.random() * 5)),
      clickRate: Math.min(100, baseClickRate + (Math.random() * 3)),
      conversionRate: Math.min(100, baseConversionRate + (Math.random() * 2)),
      engagementScore,
      subjectLineScore: 50 + (analysis.hasUrgency ? 20 : 0) + (analysis.hasBenefits ? 30 : 0),
      contentScore: (analysis.readabilityScore + analysis.structureScore) / 2,
    };
  };

  const generateRecommendations = (analysis) => {
    const recommendations = [];

    // Recommandations basées sur la longueur
    if (analysis.wordCount > 300) {
      recommendations.push({
        type: 'warning',
        message: 'Email trop long. Essayez de le réduire à moins de 300 mots.',
        priority: 'high',
      });
    } else if (analysis.wordCount < 100) {
      recommendations.push({
        type: 'info',
        message: 'Email court. Assurez-vous d\'inclure tous les éléments essentiels.',
        priority: 'medium',
      });
    }

    // Recommandations sur la structure
    if (analysis.paragraphCount < 3) {
      recommendations.push({
        type: 'warning',
        message: 'Structure peu claire. Ajoutez plus de paragraphes pour une meilleure lisibilité.',
        priority: 'high',
      });
    }

    // Recommandations sur les éléments clés
    if (!analysis.hasCallToAction) {
      recommendations.push({
        type: 'warning',
        message: 'Ajoutez un appel à l\'action clair et visible.',
        priority: 'high',
      });
    }

    if (!analysis.hasPersonalization) {
      recommendations.push({
        type: 'info',
        message: 'La personnalisation pourrait améliorer l\'engagement.',
        priority: 'medium',
      });
    }

    if (!analysis.hasUrgency) {
      recommendations.push({
        type: 'info',
        message: 'L\'ajout d\'un sentiment d\'urgence pourrait augmenter les conversions.',
        priority: 'medium',
      });
    }

    if (!analysis.hasBenefits) {
      recommendations.push({
        type: 'info',
        message: 'Mettez en avant les bénéfices pour vos lecteurs.',
        priority: 'medium',
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const handleVersionChange = async (id, content) => {
    // Mettre à jour l'état de chargement
    setVersions(versions.map(v => 
      v.id === id ? { ...v, isLoading: true } : v
    ));

    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000));

    const analysis = analyzeEmail(content);
    const metrics = generateMetrics(analysis);
    const recommendations = generateRecommendations(analysis);

    setVersions(versions.map(v => 
      v.id === id ? { 
        ...v, 
        content,
        metrics,
        recommendations,
        isLoading: false
      } : v
    ));
  };

  const MetricBar = ({ label, value, color, isLoading }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? '...' : `${value.toFixed(1)}%`}
        </Typography>
      </Box>
      {isLoading ? (
        <LinearProgress 
          sx={{ 
            height: 8, 
            borderRadius: 4,
          }} 
        />
      ) : (
        <LinearProgress 
          variant="determinate" 
          value={value} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: `${color}.lighter`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: `${color}.main`,
            }
          }} 
        />
      )}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Comparaison d'Emails
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={4}>
            {versions.map((version) => (
              <Card key={version.id} elevation={0} sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Version {version.id}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Score d'engagement">
                        <Chip 
                          label={version.isLoading ? 'Calcul...' : `Engagement: ${version.metrics.engagementScore}%`}
                          color={version.metrics.engagementScore > 50 ? 'success' : 'warning'}
                        />
                      </Tooltip>
                      <Tooltip title="Lisibilité">
                        <Chip 
                          label={version.isLoading ? 'Analyse...' : `${analyzeEmail(version.content).readability}`}
                          color={analyzeEmail(version.content).readability === 'Facile' ? 'success' : 'warning'}
                        />
                      </Tooltip>
                    </Stack>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={version.content}
                    onChange={(e) => handleVersionChange(version.id, e.target.value)}
                    placeholder="Entrez le contenu de l'email..."
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          Métriques de Performance
                        </Typography>
                        <MetricBar 
                          label="Taux d'ouverture" 
                          value={version.metrics.openRate} 
                          color="primary"
                          isLoading={version.isLoading}
                        />
                        <MetricBar 
                          label="Taux de clic" 
                          value={version.metrics.clickRate} 
                          color="secondary"
                          isLoading={version.isLoading}
                        />
                        <MetricBar 
                          label="Taux de conversion" 
                          value={version.metrics.conversionRate} 
                          color="success"
                          isLoading={version.isLoading}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          Scores de Qualité
                        </Typography>
                        <MetricBar 
                          label="Score de sujet" 
                          value={version.metrics.subjectLineScore} 
                          color="info"
                          isLoading={version.isLoading}
                        />
                        <MetricBar 
                          label="Score de contenu" 
                          value={version.metrics.contentScore} 
                          color="warning"
                          isLoading={version.isLoading}
                        />
                        <MetricBar 
                          label="Score d'engagement" 
                          value={version.metrics.engagementScore} 
                          color="success"
                          isLoading={version.isLoading}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            position: 'sticky',
            top: 20,
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recommandations par Version
              </Typography>

              {versions.map((version) => (
                <Box key={version.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Version {version.id}
                  </Typography>
                  {version.isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Analyse en cours...
                      </Typography>
                    </Box>
                  ) : version.recommendations.length > 0 ? (
                    <List dense>
                      {version.recommendations.map((rec, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            {rec.type === 'warning' ? 
                              <WarningIcon color="warning" /> : 
                              <InfoIcon color="info" />
                            }
                          </ListItemIcon>
                          <ListItemText
                            primary={rec.message}
                            primaryTypographyProps={{
                              color: rec.type === 'warning' ? 'warning.main' : 'info.main',
                              variant: 'body2',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Entrez du contenu pour obtenir des recommandations.
                    </Alert>
                  )}
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Bonnes pratiques
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Gardez vos emails entre 100 et 300 mots" 
                    secondary="Une longueur optimale pour maintenir l'attention"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Structurez votre contenu en paragraphes courts" 
                    secondary="3-4 paragraphes maximum pour une meilleure lisibilité"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Incluez un appel à l'action clair" 
                    secondary="Guidez vos lecteurs vers l'action souhaitée"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Personnalisez quand c'est possible" 
                    secondary="Utilisez les variables {name} et {company}"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmailComparison; 